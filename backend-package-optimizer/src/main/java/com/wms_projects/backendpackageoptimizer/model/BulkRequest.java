package com.wms_projects.backendpackageoptimizer.model;

// BulkRequest.java
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BulkRequest {
    @JsonProperty("availableBoxes") 
    private List<Box> availableBoxes;
    
    @JsonProperty("orders")
    private List<OrderRequest> orders;

    // Constructors
    public BulkRequest() {}

    public BulkRequest(List<Box> availableBoxes, List<OrderRequest> orders) {
        this.availableBoxes = availableBoxes;
        this.orders = orders;
    }

    // Getters and Setters
    public List<Box> getAvailableBoxes() {
        return availableBoxes;
    }

    public void setAvailableBoxes(List<Box> availableBoxes) {
        this.availableBoxes = availableBoxes;
    }

    public List<OrderRequest> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderRequest> orders) {
        this.orders = orders;
    }
}