package com.wms_projects.backendpackageoptimizer.service;

import com.wms_projects.backendpackageoptimizer.model.Box;
import com.wms_projects.backendpackageoptimizer.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoxOptimizationService {

    /**
     * Finds the smallest box that can fit all the products.
     * @param products List of products to be shipped.
     * @param availableBoxes List of available box sizes.
     * @return The smallest box that can fit all the products, or throws an exception if no box can fit.
     */
    public Box findSmallestFittingBox(List<Product> products, List<Box> availableBoxes) {
        // Calculate total dimensions of all products combined
        double totalLength = 0;
        double totalWidth = 0;
        double totalHeight = 0;

        for (Product product : products) {
            totalLength += product.getLength();
            totalWidth += product.getWidth();
            totalHeight += product.getHeight();
        }

        // Find the smallest box that can fit all the products
        Box smallestBox = null;
        for (Box box : availableBoxes) {
            if (box.getLength() >= totalLength && box.getWidth() >= totalWidth && box.getHeight() >= totalHeight) {
                if (smallestBox == null || 
                    (box.getLength() < smallestBox.getLength() && 
                     box.getWidth() < smallestBox.getWidth() && 
                     box.getHeight() < smallestBox.getHeight())) {
                    smallestBox = box;
                }
            }
        }

        if (smallestBox == null) {
            throw new IllegalArgumentException("No available box can fit all products.");
        }

        return smallestBox;
    }
}

