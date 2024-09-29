# KMeans Clustering Visualization

This web application demonstrates the KMeans clustering algorithm using various initialization methods (Random, Farthest First, KMeans++, Manual). The app is built with **React** and visualizes the clustering process step-by-step.

## Installation and Setup

### Prerequisites
- **Node.js** (v18.x or later)
- **npm** (Node Package Manager)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/andrewliu26/aliu26-assignment-2.git
   cd aliu26-assignment-2
   ```

2. **Install the dependencies**:
   ```bash
   make install
   ```

3. **Run the application**:
   ```bash
   make run
   ```

   The app will start on `http://localhost:3000`.

## How to Use

1. **Select the number of centroids (`k`)**: Input the desired number of clusters (between 1 and 10).
2. **Choose an initialization method**: Select from the dropdown.
3. **Generate New Data**: Click the "Generate New Data" button to randomize the data points.
4. **Initialize Centroids**: If you select "Random", "Farthest First", or "KMeans++", click "Initialize Centroids". For "Manual", click on the graph to place the centroids.
5. **Step through the algorithm**: Click "Step" to manually go through each step of the KMeans process.
6. **Run to Convergence**: Click "Run to Convergence" to automatically run the algorithm until it stabilizes.
7. **Reset**: Click "Reset" to clear the centroids and try different settings.

## File Structure

```
/src
  /components
    - ClusterVisualization.js   # D3.js visualization for data points and centroids
  /utils
    - kmeans.js                 # KMeans algorithm and initialization methods
  - App.js                      # Main React component
  - index.js                    # Entry point for the React app
Makefile                        # Makefile for installation and running the app
```

## GitHub Actions CI

The repository includes a GitHub Actions workflow that automatically installs dependencies and runs the application to ensure proper setup. You can find the configuration file under `.github/workflows/nodejs-app.yml`.
