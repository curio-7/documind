package com.documind.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class OllamaConfig {

    @Value("${ollama.base-url}")
    private String ollamaBaseUrl;

    @Value("${ollama.chat-model}")
    private String chatModel;

    @Value("${ollama.embedding-model}")
    private String embeddingModel;

    @Value("${ollama.timeout}")
    private int timeout;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(chatModel)
                .temperature(0.7)
                .timeout(Duration.ofSeconds(timeout))
                .build();
    }

    @Bean
    public StreamingChatLanguageModel streamingChatLanguageModel() {
        return OllamaStreamingChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(chatModel)
                .temperature(0.7)
                .timeout(Duration.ofSeconds(timeout))
                .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return OllamaEmbeddingModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(embeddingModel)
                .timeout(Duration.ofSeconds(timeout))
                .build();
    }
}
