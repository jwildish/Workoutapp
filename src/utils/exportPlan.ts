import { WeekPlan, WorkoutSettings, UserWeights } from '../types';
import { getWeights, getSuggestedWeightForWeek } from './weightTracking';

// Generate plain text format suitable for Apple Notes
export const exportToText = (
  plan: WeekPlan[],
  settings: WorkoutSettings,
  includeWeights: boolean = true
): string => {
  const weights = includeWeights ? getWeights() : {};
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════');
  lines.push('   8-WEEK HYPERTROPHY TRAINING PROGRAM');
  lines.push('═══════════════════════════════════════════');
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push(`Duration: ${settings.workoutDurationMinutes} min per workout`);
  lines.push(`Level: ${settings.fitnessLevel}`);
  lines.push('');
  lines.push('PROGRAM STRUCTURE:');
  lines.push('• 4 workouts per week (Upper/Lower split)');
  lines.push('• Week 4 is DELOAD week');
  lines.push('• Progressive overload each week');
  lines.push('');

  for (const weekPlan of plan) {
    lines.push('');
    lines.push(`${'═'.repeat(45)}`);
    lines.push(`  WEEK ${weekPlan.week}${weekPlan.isDeload ? ' (DELOAD)' : ''}`);
    lines.push(`${'═'.repeat(45)}`);
    lines.push(`Focus: ${weekPlan.focus}`);
    lines.push('');

    for (const workout of weekPlan.workouts) {
      lines.push(`${'─'.repeat(40)}`);
      lines.push(`DAY ${workout.day}: ${workout.name.split(' - ')[1]}`);
      lines.push(`Duration: ~${workout.totalDurationMinutes} min`);
      lines.push(`${'─'.repeat(40)}`);
      lines.push('');

      // Strength Section
      lines.push('▶ STRENGTH (Heavy Weight, Low Reps)');
      for (const ex of workout.strengthExercises) {
        const weightEntry = weights[ex.id]?.find(
          w => w.week === weekPlan.week && w.day === workout.day
        );
        const suggestedWeight = getSuggestedWeightForWeek(
          ex.id,
          weekPlan.week,
          ex.isCompound,
          ['quads', 'hamstrings', 'glutes'].includes(ex.muscleGroup),
          weekPlan.isDeload
        );

        let weightStr = ex.weight;
        if (weightEntry) {
          weightStr = `${weightEntry.weight}kg`;
        } else if (suggestedWeight) {
          weightStr = `~${suggestedWeight}kg (suggested)`;
        }

        lines.push(`  • ${ex.name}`);
        lines.push(`    ${ex.sets} sets × ${ex.reps} reps | Rest: ${ex.restSeconds}s`);
        lines.push(`    Weight: ${weightStr}`);
        lines.push('');
      }

      // Hypertrophy Section
      lines.push('▶ HYPERTROPHY (Moderate Weight, Higher Reps)');
      for (const ex of workout.hypertrophyExercises) {
        const weightEntry = weights[ex.id]?.find(
          w => w.week === weekPlan.week && w.day === workout.day
        );
        const suggestedWeight = getSuggestedWeightForWeek(
          ex.id,
          weekPlan.week,
          ex.isCompound,
          ['quads', 'hamstrings', 'glutes'].includes(ex.muscleGroup),
          weekPlan.isDeload
        );

        let weightStr = ex.weight;
        if (weightEntry) {
          weightStr = `${weightEntry.weight}kg`;
        } else if (suggestedWeight) {
          weightStr = `~${suggestedWeight}kg (suggested)`;
        }

        lines.push(`  • ${ex.name}`);
        lines.push(`    ${ex.sets} sets × ${ex.reps} reps | Rest: ${ex.restSeconds}s`);
        lines.push(`    Weight: ${weightStr}`);
        lines.push('');
      }

      // HIIT Section
      lines.push('▶ HIIT FINISHER (8 minutes)');
      lines.push(`  Format: ${workout.hiitSection.workSeconds}s work / ${workout.hiitSection.restSeconds}s rest`);
      lines.push(`  Rounds: ${workout.hiitSection.rounds}`);
      lines.push('  Exercises:');
      for (const hiitEx of workout.hiitSection.exercises) {
        const isCore = hiitEx.muscleGroup === 'core';
        lines.push(`    ${isCore ? '🔥' : '•'} ${hiitEx.name}${isCore ? ' (abs)' : ''}`);
      }
      lines.push('');
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════');
  lines.push('PROGRESSION GUIDELINES:');
  lines.push('═══════════════════════════════════════════');
  lines.push('');
  lines.push('Compound Upper Body: +2.5kg per week');
  lines.push('Compound Lower Body: +5kg per week');
  lines.push('Isolation Exercises: +1.25kg per week');
  lines.push('');
  lines.push('DELOAD WEEK (Week 4):');
  lines.push('• Reduce weight by 40%');
  lines.push('• Focus on form and recovery');
  lines.push('• Still complete all workouts');
  lines.push('');

  return lines.join('\n');
};

// Copy to clipboard (for Apple Notes)
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
};

// Generate HTML for PDF export
export const exportToPDFHtml = (
  plan: WeekPlan[],
  settings: WorkoutSettings
): string => {
  const weights = getWeights();

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>8-Week Hypertrophy Program</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
      padding: 20px;
    }
    h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
    h2 { font-size: 14px; background: #1a1a2e; color: white; padding: 8px; margin: 15px 0 10px; }
    h3 { font-size: 12px; background: #eee; padding: 5px; margin: 10px 0 5px; }
    .meta { text-align: center; color: #666; margin-bottom: 15px; }
    .week { page-break-inside: avoid; margin-bottom: 20px; }
    .workout { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; }
    .section { margin: 8px 0; }
    .section-title { font-weight: bold; color: #6c5ce7; margin-bottom: 5px; }
    .exercise { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dotted #eee; }
    .exercise-name { font-weight: 500; }
    .exercise-details { color: #666; font-size: 10px; }
    .hiit { background: #fff5f5; padding: 8px; border-radius: 4px; }
    .deload { background: #e8f5e9; }
    .deload-badge { background: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px; }
    .weight-input { border: 1px solid #ccc; width: 50px; padding: 2px; }
    @media print {
      .week { page-break-inside: avoid; }
      body { font-size: 10px; }
    }
  </style>
</head>
<body>
  <h1>8-Week Hypertrophy Training Program</h1>
  <div class="meta">
    Generated: ${new Date().toLocaleDateString()} |
    Duration: ${settings.workoutDurationMinutes} min |
    Level: ${settings.fitnessLevel}
  </div>
`;

  for (const weekPlan of plan) {
    html += `
  <div class="week ${weekPlan.isDeload ? 'deload' : ''}">
    <h2>Week ${weekPlan.week} ${weekPlan.isDeload ? '<span class="deload-badge">DELOAD</span>' : ''}</h2>
    <p style="margin-bottom:10px;font-style:italic;">${weekPlan.focus}</p>
`;

    for (const workout of weekPlan.workouts) {
      html += `
    <div class="workout">
      <h3>Day ${workout.day}: ${workout.name.split(' - ')[1]} (~${workout.totalDurationMinutes} min)</h3>

      <div class="section">
        <div class="section-title">Strength (Heavy)</div>
`;
      for (const ex of workout.strengthExercises) {
        const weightEntry = weights[ex.id]?.find(
          w => w.week === weekPlan.week && w.day === workout.day
        );
        html += `
        <div class="exercise">
          <span class="exercise-name">${ex.name}</span>
          <span class="exercise-details">
            ${ex.sets}×${ex.reps} | Rest ${ex.restSeconds}s |
            Weight: <input type="text" class="weight-input" value="${weightEntry?.weight || ''}" placeholder="kg">
          </span>
        </div>
`;
      }
      html += `</div>`;

      html += `
      <div class="section">
        <div class="section-title">Hypertrophy (Moderate)</div>
`;
      for (const ex of workout.hypertrophyExercises) {
        const weightEntry = weights[ex.id]?.find(
          w => w.week === weekPlan.week && w.day === workout.day
        );
        html += `
        <div class="exercise">
          <span class="exercise-name">${ex.name}</span>
          <span class="exercise-details">
            ${ex.sets}×${ex.reps} | Rest ${ex.restSeconds}s |
            Weight: <input type="text" class="weight-input" value="${weightEntry?.weight || ''}" placeholder="kg">
          </span>
        </div>
`;
      }
      html += `</div>`;

      html += `
      <div class="section hiit">
        <div class="section-title">HIIT Finisher (8 min)</div>
        <div>${workout.hiitSection.workSeconds}s work / ${workout.hiitSection.restSeconds}s rest × ${workout.hiitSection.rounds} rounds</div>
        <div style="margin-top:5px">
`;
      for (const hiitEx of workout.hiitSection.exercises) {
        const isCore = hiitEx.muscleGroup === 'core';
        html += `<span style="margin-right:10px">${isCore ? '🔥' : '•'} ${hiitEx.name}</span>`;
      }
      html += `
        </div>
      </div>
    </div>
`;
    }
    html += `</div>`;
  }

  html += `
</body>
</html>
`;

  return html;
};

// Trigger PDF download using print
export const downloadAsPDF = (plan: WeekPlan[], settings: WorkoutSettings): void => {
  const html = exportToPDFHtml(plan, settings);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// Download as text file
export const downloadAsText = (plan: WeekPlan[], settings: WorkoutSettings): void => {
  const text = exportToText(plan, settings);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout-plan-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
