package com.documind.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VectorStoreConfig {

    @Value("${POSTGRES_HOST:localhost}")
    private String host;

    @Value("${POSTGRES_DB:documind}")
    private String database;

    @Value("${spring.datasource.username}")
    private String user;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${vector-store.table-name}")
    private String table;

    @Value("${vector-store.dimension}")
    private int dimension;

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return PgVectorEmbeddingStore.builder()
                .host(host)
                .port(5432)
                .database(database)
                .user(user)
                .password(password)
                .table(table)
                .dimension(dimension)
                .build();
    }
}
