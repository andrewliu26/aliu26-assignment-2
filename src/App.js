import React, { useState, useEffect } from 'react';
import {
    initializeCentroidsRandom,
    initializeCentroidsFarthestFirst,
    initializeCentroidsKMeansPlusPlus,
    assignClusters,
    updateCentroids
} from './utils/kmeans';
import ClusterVisualization from './components/ClusterVisualization';

function App() {
    const [data, setData] = useState(generateRandomData(100));
    const [centroids, setCentroids] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [k, setK] = useState(3); // Default value for k
    const [initMethod, setInitMethod] = useState('Random'); // Default initialization method
    const [manualMode, setManualMode] = useState(false); // To track manual initialization mode

    // Automatically enable manual mode if 'Manual' initialization method is selected, and reset graph
    useEffect(() => {
        setCentroids([]); // Clear centroids when initMethod changes
        setAssignments([]); // Clear assignments when initMethod changes

        if (initMethod === 'Manual') {
            setManualMode(true);
        } else {
            setManualMode(false);
        }
    }, [initMethod]); // Effect runs whenever initMethod changes

    function initializeCentroids() {
        let newCentroids;
        switch (initMethod) {
            case 'Random':
                newCentroids = initializeCentroidsRandom(data, k);
                break;
            case 'Farthest First':
                newCentroids = initializeCentroidsFarthestFirst(data, k);
                break;
            case 'KMeans++':
                newCentroids = initializeCentroidsKMeansPlusPlus(data, k);
                break;
            case 'Manual':
                return; // No need to handle manual mode here
            default:
                newCentroids = initializeCentroidsRandom(data, k);
        }
        setCentroids(newCentroids);
    }

    function runKMeansStep() {
        if (centroids.length === 0) return;

        // Step through the KMeans algorithm
        const newAssignments = assignClusters(data, centroids);
        setAssignments(newAssignments);
        const newCentroids = updateCentroids(data, newAssignments, k);
        setCentroids(newCentroids);
    }

    function hasConverged(oldCentroids, newCentroids, threshold = 1e-4) {
        // Check if centroids have converged (i.e., the difference between old and new is small)
        return oldCentroids.every((centroid, index) => {
            return centroid.every((coord, i) => {
                return Math.abs(coord - newCentroids[index][i]) < threshold;
            });
        });
    }

    function runToConvergence() {
        let localCentroids = [...centroids]; // Start with a copy of the current centroids

        const stepUntilConverged = () => {
            // Assign clusters and update centroids based on local centroids
            const newAssignments = assignClusters(data, localCentroids);
            const newCentroids = updateCentroids(data, newAssignments, k);

            // Update state only for the visualizations
            setAssignments(newAssignments);
            setCentroids(newCentroids);

            // Check if centroids have converged
            if (hasConverged(localCentroids, newCentroids)) {
                console.log("KMeans has converged");
            } else {
                // Update the local centroids and recursively call stepUntilConverged
                localCentroids = newCentroids;
                setTimeout(stepUntilConverged, 100); // Small delay to allow for state updates
            }
        };

        stepUntilConverged(); // Start the recursion
    }

    function handleManualCentroid(x, y) {
        if (centroids.length < k) {
            const newCentroids = [...centroids, [x, y]];
            setCentroids(newCentroids);
        }
        if (centroids.length + 1 === k) {
            setManualMode(true); // Keep manual mode enabled even after centroids are placed
        }
    }

    function reset() {
        setCentroids([]);
        setAssignments([]);
        // Re-enable manual mode if it's selected
        if (initMethod === 'Manual') {
            setManualMode(true);
        } else {
            setManualMode(false);
        }
    }

    return (
        <div style={styles.appContainer}>
            <h1 style={styles.header}>KMeans Clustering</h1>

            <div style={styles.controlsContainer}>
                <div style={styles.upperControls}>
                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Initialization Controls</legend>
                        <div style={styles.inputContainer}>
                            <label style={styles.label}>Number of Centroids (k): </label>
                            <input
                                type="number"
                                value={k}
                                onChange={(e) => setK(parseInt(e.target.value))}
                                min="1"
                                max="10"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputContainer}>
                            <label style={styles.label}>Initialization Method: </label>
                            <select 
                                value={initMethod} 
                                onChange={(e) => setInitMethod(e.target.value)}
                                style={styles.select}
                            >
                                <option value="Random">Random</option>
                                <option value="Farthest First">Farthest First</option>
                                <option value="KMeans++">KMeans++</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </fieldset>

                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Data Controls</legend>
                        <button onClick={() => setData(generateRandomData(100))} style={styles.button}>Generate New Data</button>
                    </fieldset>
                </div>

                <fieldset style={styles.kmeansFieldset}>
                    <legend style={styles.legend}>KMeans Controls</legend>
                    {!manualMode && (
                        <button onClick={initializeCentroids} style={styles.button}>
                            Initialize Centroids
                        </button>
                    )}
                    <button onClick={runKMeansStep} style={styles.button}>Step</button>
                    <button onClick={runToConvergence} style={styles.button}>Run to Convergence</button>
                    <button onClick={reset} style={styles.button}>Reset</button>
                </fieldset>
            </div>

            <ClusterVisualization
                data={data}
                centroids={centroids}
                assignments={assignments}
                onManualClick={manualMode ? handleManualCentroid : null}
                style={{ marginTop: '50px', marginBottom: '50px' }} // Custom styles applied here
            />
        </div>
    );
}

function generateRandomData(size) {
    return Array.from({ length: size }, () => [Math.random(), Math.random()]);
}

const styles = {
    appContainer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#20232a',
        minHeight: '100vh',
        color: 'white',
    },
    header: {
        fontSize: '1.5rem',
        marginBottom: '20px',
        color: '#19c8f7',
    },
    controlsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    
    upperControls: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px', // Space between Initialization and Data sections
    },
    fieldset: {
        border: '1px solid #19c8f7',
        padding: '10px 20px', // 10px vertical padding, 20px horizontal padding
        borderRadius: '5px',
        display: 'inline-block',
    },
    kmeansFieldset: {
        border: '1px solid #19c8f7',
        padding: '10px 20px',
        borderRadius: '5px',
        marginTop: '20px',
        display: 'inline-block',
    },
    legend: {
        color: '#19c8f7',
        fontSize: '1.2rem',
    },
    inputContainer: {
        marginBottom: '10px',
    },
    label: {
        fontSize: '1.2rem',
        marginRight: '10px',
    },
    input: {
        padding: '5px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #19c8f7',
        backgroundColor: '#282c34',
        color: 'white',
        width: '60px',
    },
    select: {
        padding: '5px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #19c8f7',
        backgroundColor: '#282c34',
        color: 'white',
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        fontSize: '1rem',
        backgroundColor: '#19c8f7',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default App;
