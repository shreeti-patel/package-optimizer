package com.wms_projects.backendpackageoptimizer.service;
import com.wms_projects.backendpackageoptimizer.model.Box;
import com.wms_projects.backendpackageoptimizer.model.Product;
import com.wms_projects.backendpackageoptimizer.model.Placement;
import com.wms_projects.backendpackageoptimizer.model.BulkRequest;
import com.wms_projects.backendpackageoptimizer.model.OrderRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
//import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoxOptimizationService {

    // /**
    //  * Finds the smallest box that can fit all the products.
    //  * @param products List of products to be shipped.
    //  * @param availableBoxes List of available box sizes.
    //  * @return The smallest box that can fit all the products, or throws an exception if no box can fit.
    //  */
    // Existing single-order method (keep for compatibility)
    public Box findSmallestFittingBox(List<Product> products, List<Box> availableBoxes) {
        availableBoxes.sort(Comparator.comparingDouble(Box::getVolume));
        for (Box box : availableBoxes) {
            if (canFitProductsInBox(products, box)) return box;
        }
        throw new IllegalArgumentException("No available box can fit all products.");
    }

    // New bulk processing method
    public List<String> processBulk(BulkRequest bulkRequest) {
        List<String> results = new ArrayList<>();
        List<Box> sortedBoxes = bulkRequest.getAvailableBoxes().stream()
                .sorted(Comparator.comparingDouble(Box::getVolume))
                .collect(Collectors.toList());

        for (OrderRequest order : bulkRequest.getOrders()) {
            String result = "Multiple boxes needed";
            for (Box box : sortedBoxes) {
                if (canFitProductsInBox(order.getProducts(), box)) {
                    result = formatBoxDimensions(box);
                    break;
                }
            }
            results.add(generateCsvLine(order, result));
        }
        return results;
    }

    private boolean canFitProductsInBox(List<Product> products, Box box) {
        products.sort((a, b) -> Double.compare(b.getVolume(), a.getVolume()));
        List<Placement> placements = new ArrayList<>();

        for (Product product : products) {
            boolean placed = false;
            for (int rot = 0; rot < 6; rot++) {
                double[] rotatedDims = rotateProduct(product, rot);
                
                // Try placing next to existing placements
                for (Placement existing : new ArrayList<>(placements)) {
                    List<Placement> candidates = List.of(
                        new Placement(existing.getX() + existing.getLength(), existing.getY(), existing.getZ(), rotatedDims),
                        new Placement(existing.getX(), existing.getY() + existing.getWidth(), existing.getZ(), rotatedDims),
                        new Placement(existing.getX(), existing.getY(), existing.getZ() + existing.getHeight(), rotatedDims)
                    );

                    for (Placement candidate : candidates) {
                        if (fitsInBox(candidate, box) && !overlaps(candidate, placements)) {
                            placements.add(candidate);
                            placed = true;
                            break;
                        }
                    }
                    if (placed) break;
                }

                // Try origin placement
                if (!placed) {
                    Placement originCandidate = new Placement(0, 0, 0, rotatedDims);
                    if (fitsInBox(originCandidate, box) && !overlaps(originCandidate, placements)) {
                        placements.add(originCandidate);
                        placed = true;
                    }
                }

                if (placed) break;
            }
            if (!placed) return false;
        }
        return true;
    }

    // Helper methods remain unchanged
    private boolean fitsInBox(Placement placement, Box box) {
        return (placement.getX() + placement.getLength() <= box.getLength()) &&
               (placement.getY() + placement.getWidth() <= box.getWidth()) &&
               (placement.getZ() + placement.getHeight() <= box.getHeight());
    }

    private boolean overlaps(Placement candidate, List<Placement> existingPlacements) {
        return existingPlacements.stream().anyMatch(existing -> doOverlap(candidate, existing));
    }

    private boolean doOverlap(Placement a, Placement b) {
        boolean xOverlap = (a.getX() < b.getX() + b.getLength()) && (a.getX() + a.getLength() > b.getX());
        boolean yOverlap = (a.getY() < b.getY() + b.getWidth()) && (a.getY() + a.getWidth() > b.getY());
        boolean zOverlap = (a.getZ() < b.getZ() + b.getHeight()) && (a.getZ() + a.getHeight() > b.getZ());
        return xOverlap && yOverlap && zOverlap;
    }

    private double[] rotateProduct(Product product, int orientation) {
        switch (orientation) {
            case 0: return new double[]{product.getLength(), product.getWidth(), product.getHeight()};
            case 1: return new double[]{product.getLength(), product.getHeight(), product.getWidth()};
            case 2: return new double[]{product.getWidth(), product.getLength(), product.getHeight()};
            case 3: return new double[]{product.getWidth(), product.getHeight(), product.getLength()};
            case 4: return new double[]{product.getHeight(), product.getLength(), product.getWidth()};
            case 5: return new double[]{product.getHeight(), product.getWidth(), product.getLength()};
            default: throw new IllegalArgumentException("Invalid orientation");
        }
    }

    // New CSV formatting helpers
    private String formatBoxDimensions(Box box) {
        return String.format("%.1fx%.1fx%.1f", box.getLength(), box.getWidth(), box.getHeight());
    }

    private String generateCsvLine(OrderRequest order, String boxResult) {
        StringBuilder sb = new StringBuilder("ORDER");
        for (Product product : order.getProducts()) {
            sb.append(",")
              .append(product.getLength()).append(",")
              .append(product.getWidth()).append(",")
              .append(product.getHeight());
        }
        sb.append(",").append(boxResult);
        return sb.toString();
    }
}