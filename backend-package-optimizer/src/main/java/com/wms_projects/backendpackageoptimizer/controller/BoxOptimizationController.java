package com.wms_projects.backendpackageoptimizer.controller;

import com.wms_projects.backendpackageoptimizer.model.*;
import com.wms_projects.backendpackageoptimizer.service.BoxOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BoxOptimizationController {

    @Autowired
    private BoxOptimizationService boxOptimizationService;

    private static final Logger log = LoggerFactory.getLogger(BoxOptimizationController.class);
    @GetMapping(value = "/error", produces = MediaType.TEXT_PLAIN_VALUE)
    public String home() {
        return "Welcome to the Box Optimization API!";
    }

    // Existing single-order endpoint
    @PostMapping("/optimize-box")
    public ResponseEntity<Box> optimizeBox(@RequestBody BoxRequest boxRequest) {
        log.info("Single order request: {}", boxRequest);
        try {
            Box result = boxOptimizationService.findSmallestFittingBox(
                boxRequest.getProducts(), 
                boxRequest.getAvailableBoxes()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("No box found for single order", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // New bulk processing endpoint
    @PostMapping("/orders/bulk")
    public ResponseEntity<List<String>> processBulkOrders(@RequestBody BulkRequest bulkRequest) {
        log.info("bulkRequest is " + bulkRequest);
        log.info("Bulk processing request with {} orders", bulkRequest.getOrders().size());
        
        try {
            List<String> results = boxOptimizationService.processBulk(bulkRequest);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Bulk processing failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }

   
}