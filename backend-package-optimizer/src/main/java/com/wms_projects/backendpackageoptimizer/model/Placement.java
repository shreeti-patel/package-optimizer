package com.wms_projects.backendpackageoptimizer.model;

public class Placement {
    private double x;
    private double y;
    private double z;
    private double length;
    private double width;
    private double height;

    public Placement(double x, double y, double z, double[] dimensions) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.length = dimensions[0];
        this.width = dimensions[1];
        this.height = dimensions[2];
    }

    public Placement(Product product, Box box) {
        //TODO Auto-generated constructor stub
    }

    // Getters
    public double getX() { return x; }
    public double getY() { return y; }
    public double getZ() { return z; }
    public double getLength() { return length; }
    public double getWidth() { return width; }
    public double getHeight() { return height; }
}
