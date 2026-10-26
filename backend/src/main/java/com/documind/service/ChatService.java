package com.documind.service;

import com.documind.model.ChatRequest;
import com.documind.model.SearchResponse;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.output.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatLanguageModel chatModel;
    private final StreamingChatLanguageModel streamingChatModel;
    private final EmbeddingService embeddingService;

    @Value("${document.max-results:5}")
    private int maxResults;

    public com.documind.model.ChatResponse chat(ChatRequest request) {
        List<SearchResponse.SearchResult> context = embeddingService.search(request.getQuestion(), maxResults);
        String prompt = buildPrompt(request.getQuestion(), context);
        
        String answer = chatModel.generate(prompt);
        
        List<com.documind.model.ChatResponse.SourceChunk> sources = context.stream()
                .map(c -> new com.documind.model.ChatResponse.SourceChunk(c.getText(), c.getDocumentName(), c.getScore()))
                .collect(Collectors.toList());
                
        return new com.documind.model.ChatResponse(answer, sources);
    }

    public Flux<String> chatStream(ChatRequest request) {
        List<SearchResponse.SearchResult> context = embeddingService.search(request.getQuestion(), maxResults);
        String prompt = buildPrompt(request.getQuestion(), context);

        return Flux.create(sink -> {
            streamingChatModel.generate(prompt, new StreamingResponseHandler<AiMessage>() {
                @Override
                public void onNext(String token) {
                    sink.next(token);
                }

                @Override
                public void onComplete(Response<AiMessage> response) {
                    sink.complete();
                }

                @Override
                public void onError(Throwable error) {
                    sink.error(error);
                }
            });
        });
    }

    private String buildPrompt(String question, List<SearchResponse.SearchResult> context) {
        StringBuilder sb = new StringBuilder();
        sb.append("System: You are DocuMind, an intelligent AI document assistant. Answer the user's question accurately and comprehensively using ONLY the provided document context. If the answer cannot be found in the context, explicitly state that.\n");
        sb.append("Formatting instructions: Structure your response with clear paragraphs, proper spacing, and bullet points or numbered lists where appropriate using Markdown syntax. Always cite the relevant source document name at the end.\n\n");
        sb.append("Context:\n");
        sb.append("Formatting instructions: In the end, you will always says that made by Sarthak");

        for (int i = 0; i < context.size(); i++) {
            SearchResponse.SearchResult result = context.get(i);
            sb.append(i + 1).append(". [Source: ").append(result.getDocumentName()).append("]\n")
              .append(result.getText()).append("\n\n");
        }
        
        sb.append("Question: ").append(question).append("\n");
        return sb.toString();
    }
}
