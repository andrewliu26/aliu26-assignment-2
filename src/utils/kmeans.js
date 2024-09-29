// utils/kmeans.js
export function initializeCentroidsRandom(data, k) {
    const centroids = [];
    const usedIndexes = new Set();
    while (centroids.length < k) {
        const index = Math.floor(Math.random() * data.length);
        if (!usedIndexes.has(index)) {
            centroids.push(data[index]);
            usedIndexes.add(index);
        }
    }
    return centroids;
}

export function initializeCentroidsFarthestFirst(data, k) {
    const centroids = [];

    // Step 1: Randomly select the first centroid
    const firstIndex = Math.floor(Math.random() * data.length);
    centroids.push(data[firstIndex]);

    // Step 2: Select the remaining centroids
    while (centroids.length < k) {
        let farthestPoint = null;
        let maxDistance = -Infinity;

        // For each point in the dataset, find the distance to the closest centroid
        data.forEach(point => {
            // Compute the minimum distance from this point to any of the selected centroids
            const minDistance = centroids.reduce((minDist, centroid) => {
                const dist = Math.sqrt(
                    Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2)
                );
                return Math.min(minDist, dist);
            }, Infinity);

            // Find the point with the maximum distance from the closest centroid
            if (minDistance > maxDistance) {
                maxDistance = minDistance;
                farthestPoint = point;
            }
        });

        // Add the farthest point to the centroids array
        centroids.push(farthestPoint);
    }

    return centroids;
}

export function initializeCentroidsKMeansPlusPlus(data, k) {
    const centroids = [];
    
    // Step 1: Choose the first centroid randomly
    const firstIndex = Math.floor(Math.random() * data.length);
    centroids.push(data[firstIndex]);
    
    // Step 2: Select the remaining centroids based on weighted probability
    while (centroids.length < k) {
        const distances = data.map(point => {
            // For each point, find the distance to the closest centroid
            const minDistance = centroids.reduce((minDist, centroid) => {
                const dist = Math.sqrt(
                    Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2)
                );
                return Math.min(minDist, dist);
            }, Infinity);
            return minDistance;
        });

        // Compute weighted probabilities
        const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);
        const probabilities = distances.map(dist => dist / totalDistance);

        // Choose the next centroid based on the weighted probabilities
        let r = Math.random();
        let cumulativeProbability = 0;
        let selectedIndex = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (r <= cumulativeProbability) {
                selectedIndex = i;
                break;
            }
        }
        centroids.push(data[selectedIndex]);
    }

    return centroids;
}

export function assignClusters(data, centroids) {
    if (!Array.isArray(centroids) || centroids.length === 0) {
        console.error("Invalid centroids in assignClusters.");
        return [];
    }

    // Assign each point to the nearest centroid
    return data.map(point => {
        let minDistance = Infinity;
        let assignedCluster = -1;

        centroids.forEach((centroid, idx) => {
            const dist = Math.sqrt(
                Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2)
            );
            if (dist < minDistance) {
                minDistance = dist;
                assignedCluster = idx;
            }
        });

        return assignedCluster;
    });
}

export function updateCentroids(data, assignments, k) {
    const newCentroids = Array(k).fill([0, 0]);
    const counts = Array(k).fill(0);

    assignments.forEach((cluster, i) => {
        if (cluster >= 0 && cluster < k) {
            newCentroids[cluster] = [
                newCentroids[cluster][0] + data[i][0],
                newCentroids[cluster][1] + data[i][1]
            ];
            counts[cluster]++;
        }
    });

    // Divide by the number of points in each cluster to get the new centroid
    return newCentroids.map((centroid, idx) => {
        if (counts[idx] === 0) return centroid; // Avoid division by zero
        return [centroid[0] / counts[idx], centroid[1] / counts[idx]];
    });
}

