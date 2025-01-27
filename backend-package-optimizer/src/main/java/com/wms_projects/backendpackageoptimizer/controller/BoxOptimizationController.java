package com.wms_projects.backendpackageoptimizer.controller;
import com.wms_projects.backendpackageoptimizer.model.BoxRequest;
import com.wms_projects.backendpackageoptimizer.model.Box;
import com.wms_projects.backendpackageoptimizer.service.BoxOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class BoxOptimizationController {

    @Autowired
    private BoxOptimizationService boxOptimizationService;

    private static final Logger log = LoggerFactory.getLogger(BoxOptimizationController.class);

    @PostMapping("/api/optimize-box")
    public Box optimizeBox(@RequestBody BoxRequest boxRequest) {
        // Use the correct service method for box optimization
        log.info("Received request to optimize box with data: " + boxRequest);
        return boxOptimizationService.findSmallestFittingBox(boxRequest.getProducts(), boxRequest.getAvailableBoxes());
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the backend!";
    }

}

// @RestController
// @RequestMapping("/api")
// public class BoxOptimizationController {

//     private final BoxOptimizationService boxOptimizationService;

//    // @Autowired
//     public BoxOptimizationController(BoxOptimizationService boxOptimizationService) {
//         this.boxOptimizationService = boxOptimizationService;
//     }

//     /**
//      * Endpoint to find the smallest box that can fit all the given products.
//      * @param products List of products with their dimensions (length, width, height).
//      * @param availableBoxes List of available boxes with their dimensions.
//      * @return The smallest box that fits all the products, or an error message if no box can fit.
//      */
//     @PostMapping("/optimize-box")
//     public ResponseEntity<Box> getOptimizedBox(
//             @RequestBody List<Product> products,
//             @RequestParam List<Box> availableBoxes
//     ) {
//         try {
//             Box smallestBox = boxOptimizationService.findSmallestFittingBox(products, availableBoxes);
//             return ResponseEntity.ok(smallestBox);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().build();
//         }
//     }
// }
