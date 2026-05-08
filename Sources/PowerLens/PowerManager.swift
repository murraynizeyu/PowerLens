import Foundation
import IOKit.ps
import Combine

class PowerManager: ObservableObject {

    @Published var batteryLevel: Double = 0
    @Published var estimatedTimeLeft: String = "--"

    private var samples: [PowerSample] = []
    private var timer: Timer?

    init() {
        startMonitoring()
    }

    func startMonitoring() {
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { _ in
            self.collectData()
            self.calculateForecast()
        }
    }

    func getBatteryLevel() -> Double {
        let snapshot = IOPSCopyPowerSourcesInfo().takeRetainedValue()
        let sources = IOPSCopyPowerSourcesList(snapshot).takeRetainedValue() as Array

        for ps in sources {
            if let info = IOPSGetPowerSourceDescription(snapshot, ps).takeUnretainedValue() as? [String: Any],
               let capacity = info[kIOPSCurrentCapacityKey as String] as? Double,
               let max = info[kIOPSMaxCapacityKey as String] as? Double {
                return (capacity / max) * 100.0
            }
        }
        return 0
    }

    func estimatePowerUsage() -> Double {
        let level = getBatteryLevel()
        let delta = max(0.5, Double.random(in: 3...8))
        return delta * (100 - level) / 100
    }

    func collectData() {
        let sample = PowerSample(
            timestamp: Date(),
            batteryLevel: getBatteryLevel(),
            powerUsage: estimatePowerUsage()
        )

        samples.append(sample)

        if samples.count > 120 {
            samples.removeFirst()
        }

        batteryLevel = sample.batteryLevel
    }

    func calculateForecast() {
        guard samples.count > 5 else { return }

        let avgPower = samples.map { $0.powerUsage }.reduce(0, +) / Double(samples.count)

        let battery = getBatteryLevel()

        let fullCapacity: Double = 5000
        let remainingEnergy = fullCapacity * (battery / 100)

        guard avgPower > 0 else {
            estimatedTimeLeft = "Calculating..."
            return
        }

        let hours = remainingEnergy / avgPower

        let h = Int(hours)
        let m = Int((hours - Double(h)) * 60)

        DispatchQueue.main.async {
            self.estimatedTimeLeft = "\(h)h \(m)m left"
        }
    }
}
