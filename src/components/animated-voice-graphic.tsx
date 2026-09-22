import { Activity, ArrowRight, BatteryMedium, Mic, PhoneOff, ShieldCheck, ShieldAlert, Signal, UserRound, Volume2, Wifi } from "lucide-react";

const humanWave = [6, 12, 8, 20, 34, 17, 42, 58, 28, 15, 36, 51, 22, 10, 18, 31, 16, 8];
const cloneWave = [14, 36, 56, 36, 14, 36, 56, 36, 14, 36, 56, 36, 14, 36, 56, 36, 14, 36];

export function AnimatedVoiceGraphic() {
  return (
    <figure className="voice-graphic" aria-label="Illustrative sequence: a fraud caller and a user are connected on a live call, with Vaani Kavach analysing the audio between them. A voice clone pattern is detected and the user is warned.">
      <div className="graphic-heading">
        <span><ShieldCheck size={17} /> VAANI KAVACH</span>
      </div>

      <div className="graphic-stage" aria-hidden="true">
        <div className="graphic-orbit graphic-orbit-one" />
        <div className="graphic-orbit graphic-orbit-two" />
        <div className="graphic-phone graphic-phone-fraud">
          <span className="graphic-phone-volume" />
          <span className="graphic-phone-power" />
          <div className="graphic-phone-screen">
            <div className="graphic-phone-status"><span>9:41</span><span><Signal /><Wifi /><BatteryMedium /></span></div>
            <div className="graphic-phone-camera"><i /></div>
            <div className="graphic-avatar"><UserRound size={25} /></div>
            <span className="graphic-call-status"><i /> Call in progress</span>
            <strong>Suspected fraud call</strong>
            <span className="graphic-number">00:24</span>
            <div className="graphic-call-controls"><span><Mic /></span><span><Volume2 /></span></div>
            <div className="graphic-call-button"><PhoneOff size={15} /></div>
            <span className="graphic-phone-home" />
          </div>
        </div>
        <div className="graphic-connector"><span /><span /><span /></div>
        <div className="graphic-shield"><ShieldCheck size={45} strokeWidth={1.5} /></div>
        <div className="graphic-shield-label">Vaani Kavach<small>Secure live analysis</small></div>
        <div className="graphic-phone graphic-user-call">
          <span className="graphic-phone-volume" />
          <span className="graphic-phone-power" />
          <div className="graphic-phone-screen">
            <div className="graphic-phone-status"><span>9:41</span><span><Signal /><Wifi /><BatteryMedium /></span></div>
            <div className="graphic-phone-camera"><i /></div>
            <div className="graphic-avatar"><UserRound size={25} /></div>
            <span className="graphic-call-status"><i /> Call in progress</span>
            <strong>Citizen&apos;s phone</strong>
            <span className="graphic-user-status"><ShieldCheck size={10} /> Safeguarded</span>
            <div className="graphic-call-controls"><span><Mic /></span><span><Volume2 /></span></div>
            <div className="graphic-call-button"><PhoneOff size={15} /></div>
            <span className="graphic-phone-home" />
          </div>
        </div>
        <div className="graphic-warning"><ShieldAlert size={18} /><span>Suspected voice-clone detected<small>Citizen verification required</small></span></div>
      </div>

      <div className="graphic-analysis" aria-hidden="true">
        <div className="graphic-analysis-heading"><span><Activity size={14} /> Live voice assessment</span><span className="graphic-risk"><i /> <span className="risk-labels"><span>Low risk</span><span>Assessing</span><span>High risk</span></span></span></div>
        <div className="graphic-wave">
          <svg viewBox="0 0 400 76" fill="none" preserveAspectRatio="none">
            <path d="M0 38H400" stroke="currentColor" opacity=".1" />
            <g className="wave-human">{humanWave.map((height, index) => <path key={index} d={`M${8 + index * 10} ${38 - height / 2}v${height}`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${index * -0.13}s` }} />)}</g>
            <path d="M200 8V68" stroke="currentColor" strokeDasharray="3 5" opacity=".2" />
            <g className="wave-clone">{cloneWave.map((height, index) => <path key={index} d={`M${220 + index * 10} ${38 - height / 2}v${height}`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${index * -0.16}s` }} />)}</g>
          </svg>
          <span className="graphic-scan" />
        </div>
        <div className="graphic-wave-labels"><span>Human voice</span><span>Synthetic pattern</span></div>
      </div>

      <figcaption className="graphic-steps" aria-hidden="true"><span>Live call</span><ArrowRight /><span>Assessment</span><ArrowRight /><span>Citizen safeguarded</span></figcaption>
    </figure>
  );
}
