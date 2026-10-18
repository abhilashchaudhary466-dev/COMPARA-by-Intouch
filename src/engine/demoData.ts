/**
 * Nexus Write — Educational Demo Datasets
 * Curated text samples demonstrating different writing characteristics.
 */

export interface DemoItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  passageA: string;
  passageB?: string;
  idealGoal: 'academic' | 'research' | 'professional' | 'essay';
}

export const DEMO_DATASETS: DemoItem[] = [
  {
    id: 'demo-1-strong',
    title: 'DEMO 1 — Strong Writing',
    badge: 'High Variety & Balance',
    description: 'Exemplary essay section featuring rhythmic sentence variation, high vocabulary diversity, and zero filler clutter.',
    passageA: `Scientific progress relies upon transparent inquiry and rigorous methodology. When researchers publish their data openly, independent laboratories can verify findings and identify subtle anomalies. This collaborative dynamic accelerates discovery across disciplines. 

Modern computational models provide unprecedented simulation fidelity. Yet without reproducible evidence, mathematical projections remain unproven hypotheses. Ultimately, enduring scientific breakthroughs emerge from the disciplined intersection of theoretical curiosity and experimental verification.`,
    passageB: `Computational tools have revolutionized contemporary scientific discovery. By allowing researchers to simulate complex biochemical interactions, algorithms reduce years of laboratory trial and error into mere hours of high-throughput analysis.

However, computational simulations must never replace empirical physical experiments. Peer-reviewed replication remains the foundational pillar of modern academic integrity. When theoretical models and tangible experimental outcomes align, scientific progress advances with enduring reliability.`,
    idealGoal: 'academic'
  },
  {
    id: 'demo-2-repetitive',
    title: 'DEMO 2 — Repetitive Writing',
    badge: 'Repetition Diagnostic',
    description: 'Demonstrates heavy repetition of words such as "technology", "important", "students", and "future".',
    passageA: `Technology is very important for all modern students. Technology changes how students learn in the classroom, and technology also changes how students interact with each other. It is really important to understand that technology will be even more important in the future.

Because technology is so important, schools must invest in technology tools. Students who use technology will have a good future, but students who do not use technology might struggle. Technology is simply the most important thing for students today.`,
    passageB: `Digital tools provide significant opportunities for contemporary learners. Online platforms expand instructional reach and enable scholars to collaborate across geographic boundaries. Developing computational literacy prepares individuals for the demands of evolving technical environments.`,
    idealGoal: 'essay'
  },
  {
    id: 'demo-3-similar',
    title: 'DEMO 3 — Similar Passages',
    badge: 'Comparison & Overlap',
    description: 'Two passages exploring renewable energy infrastructure with high meaningful vocabulary overlap, highlighting explainable similarity.',
    passageA: `Renewable energy infrastructure requires substantial capital investment to transform municipal power grids. Solar photovoltaic panels and offshore wind turbines generate clean electricity while reducing greenhouse gas emissions. However, grid resilience depends on advanced battery storage systems capable of balancing intermittent renewable power generation during peak demand.`,
    passageB: `Modern power grids require substantial renewable energy infrastructure to achieve carbon neutrality. Offshore wind turbines and solar photovoltaic systems generate electrical power while lowering greenhouse gas emissions. Integrating large-scale battery storage facilities is vital to balance intermittent generation and maintain municipal grid resilience.`,
    idealGoal: 'research'
  },
  {
    id: 'demo-4-academic',
    title: 'DEMO 4 — Academic Writing',
    badge: 'Formal & Dense',
    description: 'Formal scholarly tone with empirical terminology, complex syntax, and conceptual methodology.',
    passageA: `Empirical evaluations of distributed ledger protocols demonstrate notable trade-offs between consensus latency and fault tolerance. Furthermore, quantitative measurements corroborate the hypothesis that decentralized validation introduces measurable latency penalties. Consequently, researchers must calibrate block-propagation mechanics against computational overhead to preserve Byzantine fault-tolerant security parameters across heterogeneous network topologies.`,
    passageB: `The consensus mechanism within decentralized distributed networks governs both processing latency and operational fault tolerance. Empirical investigations indicate that validating distributed transactions across unsynchronized nodes imposes demonstrable computational friction. Therefore, systems engineering must systematically balance throughput against Byzantine security constraints.`,
    idealGoal: 'academic'
  },
  {
    id: 'demo-5-readability',
    title: 'DEMO 5 — Poor Readability',
    badge: 'Run-on & Fillers',
    description: 'Excessively long run-on sentences loaded with filler words ("basically", "actually", "really") and vague language.',
    passageA: `Basically, the whole thing about how organizations communicate is really quite complicated because people just don't actually realize that sending tons of confusing messages makes everybody very confused and overwhelmed, and furthermore when managers don't clearly state what the good priorities are, team members sort of just guess what they should do next, which actually creates a lot of bad delays and mistakes that could have been totally avoided if somebody had just written down simple instructions in the first place.`,
    passageB: `Clear organizational communication prevents operational bottlenecks. When leadership articulates explicit priorities and simple written guidelines, cross-functional teams execute tasks without ambiguity or compounding delays.`,
    idealGoal: 'professional'
  }
];
