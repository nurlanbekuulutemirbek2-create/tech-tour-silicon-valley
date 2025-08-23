interface BookingProgressProps {
  currentStep: number
  steps: string[]
}

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-green-500 text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  flex-1 h-0.5 mx-4 transition-colors
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
