export function playMusic(onBeat: () => void) {
    // Check for AudioContext support
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 80;

    gain.gain.value = 0.1; // Lowered volume slightly to be pleasant
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    let beat = setInterval(() => onBeat(), 500);

    setTimeout(() => {
        try {
            osc.stop();
            clearInterval(beat);
            ctx.close();
        } catch (e) { }
    }, 9000);
}
