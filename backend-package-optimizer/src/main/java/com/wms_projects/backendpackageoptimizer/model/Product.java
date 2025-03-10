package com.wms_projects.backendpackageoptimizer.model;

public class Product {
    private double length;
    private double width;
    private double height;

    // Default Constructor
    public Product() {}

    // Parameterized Constructor
    public Product(double length, double width, double height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    // Getters and Setters
    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    @Override
    public String toString() {
        return "Product{" +
                "length=" + length +
                ", width=" + width +
                ", height=" + height +
                '}';
    }

    public double getSmallestDimension() {
        return Math.min(length, Math.min(width, height));
    }

    public double getVolume() {
        return this.length * this.width * this.height;
    }
    
}
