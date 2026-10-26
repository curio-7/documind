package com.documind.controller;

import com.documind.model.SearchRequest;
import com.documind.model.SearchResponse;
import com.documind.service.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    private final EmbeddingService embeddingService;

    @PostMapping
    public ResponseEntity<SearchResponse> search(@RequestBody SearchRequest request) {
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        int maxResults = request.getMaxResults() != null ? request.getMaxResults() : 5;
        return ResponseEntity.ok(new SearchResponse(embeddingService.search(request.getQuery(), maxResults)));
    }
}
