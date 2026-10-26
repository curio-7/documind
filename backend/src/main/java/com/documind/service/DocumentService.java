package com.documind.service;

import com.documind.model.Document;
import com.documind.model.DocumentResponse;
import com.documind.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final EmbeddingService embeddingService;

    @Value("${document.chunk-size:512}")
    private int chunkSize;

    @Value("${document.chunk-overlap:50}")
    private int chunkOverlap;

    public DocumentResponse uploadDocument(MultipartFile file) {
        if (file.getContentType() == null || !file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported");
        }

        Document doc = Document.builder()
                .fileName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .status(Document.DocumentStatus.PROCESSING)
                .build();
        
        doc = documentRepository.save(doc);

        try {
            processDocumentAsync(doc.getId(), file.getBytes());
        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            doc.setStatus(Document.DocumentStatus.FAILED);
            documentRepository.save(doc);
            throw new RuntimeException("Failed to read file bytes", e);
        }

        return DocumentResponse.from(doc);
    }

    @Async
    public void processDocumentAsync(UUID documentId, byte[] pdfBytes) {
        Document doc = documentRepository.findById(documentId).orElseThrow();
        try {
            try (PDDocument pdDocument = Loader.loadPDF(pdfBytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(pdDocument);
                int pageCount = pdDocument.getNumberOfPages();

                List<String> chunks = splitIntoChunks(text, chunkSize, chunkOverlap);
                
                embeddingService.embedAndStore(chunks, documentId, doc.getFileName());

                doc.setPageCount(pageCount);
                doc.setChunkCount(chunks.size());
                doc.setStatus(Document.DocumentStatus.COMPLETED);
                doc.setProcessedAt(LocalDateTime.now());
                documentRepository.save(doc);
                log.info("Successfully processed document: {}", doc.getFileName());
            }
        } catch (Exception e) {
            log.error("Failed to process document: {}", doc.getFileName(), e);
            doc.setStatus(Document.DocumentStatus.FAILED);
            documentRepository.save(doc);
        }
    }

    private List<String> splitIntoChunks(String text, int size, int overlap) {
        // Clean whitespace
        text = text.replaceAll("\\s+", " ").trim();
        List<String> chunks = new ArrayList<>();
        if (text.isEmpty()) return chunks;

        int start = 0;
        while (start < text.length()) {
            int end = Math.min(start + size, text.length());
            // Avoid splitting words if possible
            if (end < text.length() && text.charAt(end) != ' ' && text.lastIndexOf(' ', end) > start) {
                end = text.lastIndexOf(' ', end);
            }
            chunks.add(text.substring(start, end).trim());
            start = end - overlap;
            if (start <= 0 || end == text.length()) {
                start = end; // Prevent infinite loop and handle final chunk
            }
        }
        return chunks.stream().filter(c -> !c.isEmpty()).collect(Collectors.toList());
    }

    public List<DocumentResponse> getAllDocuments() {
        return documentRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(DocumentResponse::from)
                .collect(Collectors.toList());
    }

    public DocumentResponse getDocument(UUID id) {
        return documentRepository.findById(id)
                .map(DocumentResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    public void deleteDocument(UUID id) {
        Document doc = documentRepository.findById(id).orElseThrow();
        embeddingService.deleteByDocumentId(id);
        documentRepository.delete(doc);
    }
}
