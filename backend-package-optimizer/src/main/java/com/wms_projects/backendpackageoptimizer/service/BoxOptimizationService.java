package com.wms_projects.backendpackageoptimizer.service;
import com.wms_projects.backendpackageoptimizer.model.Box;
import com.wms_projects.backendpackageoptimizer.model.Product;
import com.wms_projects.backendpackageoptimizer.model.Placement;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
public class BoxOptimizationService {

    // /**
    //  * Finds the smallest box that can fit all the products.
    //  * @param products List of products to be shipped.
    //  * @param availableBoxes List of available box sizes.
    //  * @return The smallest box that can fit all the products, or throws an exception if no box can fit.
    //  */
   public Box findSmallestFittingBox(List<Product> products, List<Box> availableBoxes) {
    // Sort available boxes by volume (ascending)
    availableBoxes.sort(Comparator.comparingDouble(Box::getVolume));

    // Try to fit products into each box
    for (Box box : availableBoxes) {
        if (canFitProductsInBox(products, box)) {
            return box; // Return the first box that can fit all products
        }
    }

    throw new IllegalArgumentException("No available box can fit all products.");
}

private boolean canFitProductsInBox(List<Product> products, Box box) {
    products.sort((a, b) -> Double.compare(b.getVolume(), a.getVolume()));
    List<Placement> placements = new ArrayList<>();

    for (Product product : products) {
        boolean placed = false;
        for (int rot = 0; rot < 6; rot++) { // Check all rotations
            double[] rotatedDims = rotateProduct(product, rot);
           // double rotatedLength = rotatedDims[0];
           // double rotatedWidth = rotatedDims[1];
           // double rotatedHeight = rotatedDims[2];

            // Try placing next to existing placements
            for (Placement existing : new ArrayList<>(placements)) {
                // Generate positions along x, y, z axes
                List<Placement> candidates = Arrays.asList(
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

            // Try placing at origin (0,0,0) if not already occupied
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
private boolean fitsInBox(Placement placement, Box box) {
    return (placement.getX() + placement.getLength() <= box.getLength()) &&
           (placement.getY() + placement.getWidth() <= box.getWidth()) &&
           (placement.getZ() + placement.getHeight() <= box.getHeight());
}
private boolean overlaps(Placement candidate, List<Placement> existingPlacements) {
    for (Placement existing : existingPlacements) {
        if (doOverlap(candidate, existing)) {
            return true;
        }
    }
    return false;
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
// private boolean tryPlaceProduct(Placement placement, Product product, Box box) {
//     // Try all 6 possible orientations of the product
//     for (int i = 0; i < 6; i++) {
//         double[] rotatedDimensions = rotateProduct(product, i);

//         if (placement == null) {
//             // Place product at (0, 0, 0) for the first placement
//             if (rotatedDimensions[0] <= box.getLength() &&
//                 rotatedDimensions[1] <= box.getWidth() &&
//                 rotatedDimensions[2] <= box.getHeight()) {
//                 return true;
//             }
//         } else {
//             // Place relative to an existing placement
//             double x = placement.getX() + placement.getLength();
//             double y = placement.getY();
//             double z = placement.getZ();

//             if (x + rotatedDimensions[0] <= box.getLength() &&
//                 y + rotatedDimensions[1] <= box.getWidth() &&
//                 z + rotatedDimensions[2] <= box.getHeight()) {
//                 return true;
//             }
//         }
//     }

//     return false;
// }


}

