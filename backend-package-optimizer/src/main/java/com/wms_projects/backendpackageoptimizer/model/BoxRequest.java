package com.wms_projects.backendpackageoptimizer.model;

import java.util.List;

public class BoxRequest {
    private List<Product> products;
    private List<Box> availableBoxes;

    // Getter and Setter for products
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    // Getter and Setter for availableBoxes
    public List<Box> getAvailableBoxes() {
        return availableBoxes;
    }

    public void setAvailableBoxes(List<Box> availableBoxes) {
        this.availableBoxes = availableBoxes;
    }
}

