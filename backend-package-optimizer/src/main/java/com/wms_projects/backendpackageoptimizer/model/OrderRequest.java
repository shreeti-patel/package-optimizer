package com.wms_projects.backendpackageoptimizer.model;

import java.util.List;

public class OrderRequest {
    private List<Product> products;

    // Constructors
    public OrderRequest() {}

    public OrderRequest(List<Product> products) {
        this.products = products;
    }

    // Getters and Setters
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}