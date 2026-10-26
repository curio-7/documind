package com.documind.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fileName;
    
    private Long fileSize;
    
    @Builder.Default
    private Integer pageCount = 0;
    
    @Builder.Default
    private Integer chunkCount = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.PROCESSING;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    public enum DocumentStatus {
        PROCESSING,
        COMPLETED,
        FAILED
    }
}
