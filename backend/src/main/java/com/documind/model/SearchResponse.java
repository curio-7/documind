package com.documind.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    private List<SearchResult> results;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchResult {
        private String text;
        private String documentName;
        private double score;
        private Map<String, String> metadata;
    }
}
