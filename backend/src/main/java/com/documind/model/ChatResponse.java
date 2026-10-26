package com.documind.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String answer;
    private List<SourceChunk> sources;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceChunk {
        private String text;
        private String documentName;
        private double score;
    }
}
