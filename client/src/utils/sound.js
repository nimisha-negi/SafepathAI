export async function playBeep() {
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  await audio.play();
}
