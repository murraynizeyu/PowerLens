import SwiftUI

struct MenuBarView: View {

    @ObservedObject var power: PowerManager

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {

            Text("🔋 Battery: \(Int(power.batteryLevel))%")
                .font(.headline)

            Text("⏳ \(power.estimatedTimeLeft)")
                .font(.title3)
                .bold()

            Divider()

            Text("AI Power Forecast")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding(10)
        .frame(width: 200)
    }
}
