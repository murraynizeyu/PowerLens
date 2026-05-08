import Foundation

struct PowerSample: Identifiable {
    let id = UUID()
    let timestamp: Date
    let batteryLevel: Double
    let powerUsage: Double // mW
}
