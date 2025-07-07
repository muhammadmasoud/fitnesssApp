// Web Worker for heavy calculations
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'calculateBMI': {
      const { weight, height } = data;
      const bmi = calculateBMI(weight, height);
      self.postMessage({ type: 'bmiResult', data: bmi });
      break;
    }

    case 'calculateCalories': {
      const { age, gender, weight: userWeight, height: userHeight, activityLevel } = data;
      const calories = calculateCalories(age, gender, userWeight, userHeight, activityLevel);
      self.postMessage({ type: 'caloriesResult', data: calories });
      break;
    }

    case 'calculateWorkoutStats': {
      const { workouts } = data;
      const stats = calculateWorkoutStats(workouts);
      self.postMessage({ type: 'workoutStatsResult', data: stats });
      break;
    }

    default:
      self.postMessage({ type: 'error', data: 'Unknown calculation type' });
  }
});

// Calculate BMI
function calculateBMI(weight, height) {
  // Convert height from cm to m
  const heightInMeters = height / 100;

  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);

  // Determine BMI category
  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: bmi.toFixed(1),
    category
  };
}

// Calculate daily calorie needs
function calculateCalories(age, gender, weight, height, activityLevel) {
  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Apply activity multiplier
  let activityMultiplier;
  switch (activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'veryActive':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2;
  }

  const maintenanceCalories = Math.round(bmr * activityMultiplier);

  return {
    maintenance: maintenanceCalories,
    weightLoss: Math.round(maintenanceCalories * 0.8), // 20% deficit
    weightGain: Math.round(maintenanceCalories * 1.15) // 15% surplus
  };
}

// Calculate workout statistics
function calculateWorkoutStats(workouts) {
  if (!workouts || workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      averageDuration: 0,
      averageCalories: 0,
      mostFrequentType: 'None'
    };
  }

  // Calculate total duration and calories
  let totalDuration = 0;
  let totalCalories = 0;

  // Count workout types
  const workoutTypes = {};

  workouts.forEach(workout => {
    // Extract duration in minutes
    const durationMatch = workout.duration.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 0;

    totalDuration += duration;
    totalCalories += workout.calories || 0;

    // Count workout type
    const type = workout.title;
    workoutTypes[type] = (workoutTypes[type] || 0) + 1;
  });

  // Find most frequent workout type
  let mostFrequentType = 'None';
  let maxCount = 0;

  Object.entries(workoutTypes).forEach(([type, count]) => {
    if (count > maxCount) {
      mostFrequentType = type;
      maxCount = count;
    }
  });

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalCalories,
    averageDuration: Math.round(totalDuration / workouts.length),
    averageCalories: Math.round(totalCalories / workouts.length),
    mostFrequentType
  };
}
