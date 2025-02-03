# **3D Box Packing Algorithm Report**  
*Optimizing Product Placement into the Smallest Possible Box*

---

## **1. Classes Overview**  

### **1.1 `Product` Class  
**Purpose**: Represents a product to be packed.  
**Properties**:  
- `length`, `width`, `height`: Dimensions of the product.  
**Key Methods**:  
- `getVolume()`: Returns `length × width × height`.  
- `getSmallestDimension()`: Returns the smallest dimension (used for sorting).  

### **1.2 `Box` Class  
**Purpose**: Represents a box that can hold products.  
**Properties**:  
- `length`, `width`, `height`: Dimensions of the box.  
**Key Methods**:  
- Inherits `getVolume()` from `Product` (since a box is treated as a container).  

### **1.3 `Placement` Class  
**Purpose**: Tracks where a product is placed inside a box.  
**Properties**:  
- `x`, `y`, `z`: Coordinates of the product’s bottom-left corner in the box.  
- `length`, `width`, `height`: Dimensions of the product in its current orientation.  

### **1.4 `BoxRequest` Class  
**Purpose**: Wraps user input for the algorithm.  
**Properties**:  
- `products`: List of products to pack.  
- `availableBoxes`: List of candidate boxes.  

---

## **2. Core Algorithm: `BoxOptimizationService`  

### **2.1 `findSmallestFittingBox`  
**Purpose**: Finds the smallest box that fits all products.  
**Steps**:  
1. **Sort Boxes by Volume**: Checks smaller boxes first.  
2. **Check Each Box**: Uses `canFitProductsInBox` to validate fit.  
3. **Return Result**: Returns the first valid box or throws an error.  

```java
public Box findSmallestFittingBox(List<Product> products, List<Box> availableBoxes) {
    availableBoxes.sort(Comparator.comparingDouble(Box::getVolume));
    for (Box box : availableBoxes) {
        if (canFitProductsInBox(products, box)) return box;
    }
    throw new IllegalArgumentException("No box fits all products.");
}
```

---

### **2.2 `canFitProductsInBox`  
**Purpose**: Checks if all products fit in a specific box.  
**Steps**:  
1. **Sort Products by Volume**: Larger products first (reduces wasted space).  
2. **Track Placements**: Uses a list of `Placement` objects to avoid overlaps.  
3. **Attempt Placement**: Tries all rotations and positions for each product.  

```java
private boolean canFitProductsInBox(List<Product> products, Box box) {
    products.sort((a, b) -> Double.compare(b.getVolume(), a.getVolume()));
    List<Placement> placements = new ArrayList<>();
    
    for (Product product : products) {
        boolean placed = tryPlaceProduct(product, box, placements);
        if (!placed) return false;
    }
    return true;
}
```

---

### **2.3 `tryPlaceProduct`  
**Purpose**: Tries to place a product in the box without overlaps.  
**Steps**:  
1. **Check All Rotations**: 6 possible orientations (e.g., 3×2×1, 2×3×1).  
2. **Generate Positions**:  
   - Along x, y, or z axes of existing placements.  
   - At the origin `(0, 0, 0)` if empty.  
3. **Validate Placement**: Uses `fitsInBox` and `overlaps` checks.  

```java
private boolean tryPlaceProduct(Product product, Box box, List<Placement> placements) {
    for (int rotation = 0; rotation < 6; rotation++) {
        double[] dims = rotateProduct(product, rotation);
        // Check placement at origin or next to existing items
        if (attemptPlacement(dims, box, placements)) return true;
    }
    return false;
}
```

---

### **2.4 Rotation & Overlap Detection  

#### **`rotateProduct`  
**Purpose**: Generates rotated dimensions for a product.  
**Example**:  
- Input: `Product(3, 2, 1)` → Rotations include `[3,2,1]`, `[3,1,2]`, etc.  

#### **`overlaps` & `doOverlap`  
**Purpose**: Detect if two placements overlap in 3D space.  
**Logic**:  
- Two boxes overlap if they intersect on **all** axes (x, y, z).  

```java
private boolean overlaps(Placement candidate, List<Placement> existing) {
    for (Placement p : existing) {
        if (doOverlap(candidate, p)) return true;
    }
    return false;
}

private boolean doOverlap(Placement a, Placement b) {
    boolean xOverlap = a.getX() < b.getX() + b.getLength() && a.getX() + a.getLength() > b.getX();
    boolean yOverlap = a.getY() < b.getY() + b.getWidth() && a.getY() + a.getWidth() > b.getY();
    boolean zOverlap = a.getZ() < b.getZ() + b.getHeight() && a.getZ() + a.getHeight() > b.getZ();
    return xOverlap && yOverlap && zOverlap;
}
```

---

## **3. Workflow Summary**  

1. **Input**: List of products and boxes.  
2. **Sort Boxes**: By volume (ascending).  
3. **Sort Products**: By volume (descending).  
4. **Place Products**:  
   - Try all rotations and positions.  
   - Avoid overlaps and boundary violations.  
5. **Output**: Smallest valid box or an error.  

---

## **4. Key Strengths**  
- **Efficiency**: Prioritizes smaller boxes and larger products.  
- **Flexibility**: Tests all 6 rotations for optimal packing.  
- **Accuracy**: Rigorous overlap and boundary checks.  

This algorithm ensures minimal wasted space while guaranteeing valid placements.