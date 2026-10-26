package com.documind.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DocumentResponse {
    private UUID id;
    private String fileName;
    private Long fileSize;
    private Integer pageCount;
    private Integer chunkCount;
    private String status;
    private LocalDateTime uploadedAt;
    private LocalDateTime processedAt;

    public static DocumentResponse from(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .fileSize(doc.getFileSize())
                .pageCount(doc.getPageCount())
                .chunkCount(doc.getChunkCount())
                .status(doc.getStatus().name())
                .uploadedAt(doc.getUploadedAt())
                .processedAt(doc.getProcessedAt())
                .build();
    }
}
