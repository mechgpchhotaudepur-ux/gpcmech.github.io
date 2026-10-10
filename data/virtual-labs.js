/*
  Virtual Lab data for the console.
  Source: Virtual Laboratory Training Document (checked 05 Oct 2026) and each lab's own
  "List of experiments" page on vlabs.ac.in (read 10 Oct 2026).

  HOW TO EDIT
  - To add an experiment: add ["Title", "path/"] to the lab's "exps" list. The path is added to the lab's host.
  - To map a lab to a course: edit COURSES below (sem, course name, lab ids, note).
  - Keep the commas and brackets as they are. Check the site after every change.
*/
window.VLAB = {
  checked: "10 Oct 2026",

  hosts: {
    NITK: "NIT Karnataka",
    IITKGP: "IIT Kharagpur",
    DLBG: "Dayalbagh Educational Institute",
    COEP: "COEP Technological University",
    IITK: "IIT Kanpur",
    IIITH: "IIIT Hyderabad"
  },

  labs: [
    { id: "L1", name: "Engineering Graphics", host: "NITK", site: "https://eg-nitk.vlabs.ac.in/",
      keywords: "projection, isometric, orthographic, sections",
      exps: [
        ["Introduction to Engineering Drawing", "exp/engineering-drawing/"],
        ["Projection of Points", "exp/projections-of-points/"],
        ["Projection of Lines - Simple Positions", "exp/simple-positions/"],
        ["Projection of Line inclined to both planes", "exp/projections-lines-inclined/"],
        ["Projection of Planes", "exp/projections-of-planes/"],
        ["Projection of Solids", "exp/projections-of-solids/"],
        ["Projection of Planes - Auxiliary Plane Method", "exp/planes-auxiliary-plane/"],
        ["Projection of Solids - Auxiliary Plane Method", "exp/solids-auxiliary-plane/"],
        ["Conversion of Isometric to Orthographic view", "exp/isometric-to-orthographic-view/"],
        ["Conversion of Orthographic to Isometric view", "exp/orthographic-to-isometric/"]
      ] },
    { id: "L2", name: "Strength of Materials", host: "NITK", site: "https://sm-nitk.vlabs.ac.in/",
      keywords: "tensile, hardness, impact, torsion, shear",
      exps: [
        ["Izod Impact Test", "exp/izod-impact-test/"],
        ["Charpy Impact Test", "exp/charpy-impact-test/"],
        ["Direct Shear Test on Mild Steel Rod", "exp/direct-shear-test-steel-rod/"],
        ["Direct Shear Test on Timber Specimen", "exp/direct-shear-test-timber/"],
        ["Direct Shear Test on Mild Steel Plate", "exp/direct-shear-test-steel-plate/"],
        ["Brinell Hardness Test", "exp/brinell-hardness-test/"],
        ["Bending Test on Mild Steel", "exp/bending-test-mild-steel/"],
        ["Rockwell Hardness Test", "exp/rockwell-hardness-test/"],
        ["Vickers Hardness Test", "exp/vickers-hardness-test/"],
        ["Tensile Test on Mild Steel", "exp/tensile-test-mild-steel/"],
        ["Tensile Test on Cast Iron", "exp/tensile-test-cast-iron/"],
        ["Compression Test on Mild Steel", "exp/compression-test-mild-steel/"],
        ["Compression Test on Cast Iron", "exp/compression-test-cast-iron/"],
        ["Torsion Test on Mild Steel", "exp/torsion-test-mild-steel/"]
      ] },
    { id: "L3", name: "Engineering Dynamics", host: "DLBG", site: "https://ed-dei.vlabs.ac.in/",
      keywords: "inertia, energy, momentum, vibration",
      exps: [
        ["Moment of inertia of a flywheel", "exp/moment-of-inertia-flywheel/"],
        ["Mass moment of inertia of a pendulum (ordinary, compound)", "exp/mass-moment-inertia-pendulum/"],
        ["Rolling motion on horizontal / inclined plane", "exp/rolling-motion-inclined-plane/"],
        ["Gravitational acceleration, terminal speed and drag force", "exp/gravitational-acceleration-drag-force/"],
        ["Conservation of total mechanical energy", "exp/conservation-mechanical-energy/"],
        ["Coefficient of restitution and conservation of momentum", "exp/conservation-of-momentum-collision/"],
        ["Torque and angular acceleration; work-energy theorem (rotation)", "exp/torque-angular-acceleration/"],
        ["Conservation of angular momentum (gyroscope)", "exp/conservation-angular-momentum-gyroscope/"],
        ["Coriolis component of acceleration", "exp/coriolis-component-acceleration/"],
        ["Free vibration of SDOF mass-spring system", "exp/free-vibration-sdof-spring/"]
      ] },
    { id: "L4", name: "Mechanics of Machine", host: "NITK", site: "https://mm-nitk.vlabs.ac.in/",
      keywords: "four-bar, velocity, acceleration, slider-crank",
      exps: [
        ["Position analysis of Grashof four bar mechanism", "exp/position-analysis-grashof/"],
        ["Velocity analysis of Grashof four bar mechanism", "exp/velocity-analysis-grashof/"],
        ["Acceleration analysis of Grashof four bar mechanism", "exp/acceleration-analysis-grashof/"],
        ["Position analysis of non-Grashof four bar mechanism", "exp/position-analysis-nongrashof/"],
        ["Velocity analysis of non-Grashof four bar mechanism", "exp/velocity-analysis-nongrashof/"],
        ["Acceleration analysis of non-Grashof four bar mechanism", "exp/acceleration-analysis-nongrashof/"],
        ["Position analysis of slider crank mechanism", "exp/position-analysis-slider-crank/"],
        ["Velocity analysis of slider crank mechanism", "exp/velocity-analysis-slider-crank/"],
        ["Acceleration analysis of slider crank mechanism", "exp/acceleration-analysis-slider-crank/"],
        ["Position analysis of slider crank mechanism with offset", "exp/position-analysis-slider-crank-offset/"],
        ["Position analysis of Scotch yoke mechanism", "exp/position-analysis-scotch-yoke/"],
        ["Velocity analysis of Scotch yoke mechanism", "exp/velocity-analysis-scotch-yoke/"],
        ["Acceleration analysis of Scotch yoke mechanism", "exp/acceleration-analysis-scotch-yoke/"],
        ["Position analysis of elliptical trammel", "exp/position-analysis-elliptical-trammel/"]
      ] },
    { id: "L5", name: "Kinematics and Dynamics of Mechanisms", host: "IITKGP", site: "https://kdm-iitkgp.vlabs.ac.in/",
      keywords: "four-bar, position analysis, inversions",
      exps: [
        ["Simple drawing board", "exp/simple-drawing-board/"],
        ["RRPR Grashofian inverted slider crank", "exp/rrpr-inverted-slider-crank/"],
        ["RRRR Grashofian double crank", "exp/rrrr-double-crank/"],
        ["RRRR Grashofian crank rocker", "exp/rrrr-crank-rocker/"],
        ["RRRR Grashofian double rocker", "exp/rrrr-double-rocker/"],
        ["RRRR non-Grashofian double rocker", "exp/rrrr-non-grashofian-double-rocker/"],
        ["RRRP Grashofian slider crank", "exp/rrrp-slider-crank/"],
        ["RRPR Grashofian inverted slider crank rocker", "exp/rrpr-inverted-slider-crank-rocker/"],
        ["RPRR Grashofian inverted slider crank", "exp/rprr-slider-crank/"],
        ["RPRR Grashofian inverted slider crank rocker", "exp/rprr-slider-crank-rocker/"]
      ] },
    { id: "L6", name: "Mechanisms and Robotics", host: "IITKGP", site: "https://mr-iitkgp.vlabs.ac.in/",
      keywords: "cam, quick return, PUMA, robot programming",
      exps: [
        ["Movemaster", "exp/movemaster/"],
        ["Forward kinematics of PUMA 560", "exp/forward-kinematics/"],
        ["Inverse kinematics of PUMA 560", "exp/inverse-kinematics/"],
        ["KGP 50", "exp/kgp/"],
        ["Oldham coupling mechanism", "exp/oldham-coupling-mechanism/"],
        ["Quick return mechanism", "exp/quick-return-mechanism/"],
        ["Cam follower mechanism", "exp/cam-follower-mechanism/"],
        ["Robot teaching using VAL programming", "exp/val-programming/"]
      ] },
    { id: "L7", name: "Dynamics of Machine", host: "NITK", site: "https://dom-nitk.vlabs.ac.in/",
      keywords: "governor, flywheel, balancing",
      exps: [
        ["Dynamic analysis of four bar mechanism", "exp/four-bar-mechanism/"],
        ["Dynamic analysis of slider crank mechanism", "exp/slider-crank-mechanism/"],
        ["Proell governor", "exp/proell-governet/"],
        ["Porter governor", "exp/porter-governer/"],
        ["Hartnell governor", "exp/hartnell-governer/"],
        ["Balancing of multiple masses in a single plane", "exp/multiple-mass-in-single-plane/"],
        ["Balancing of multiple masses in multiple planes", "exp/muliple-mass-in-multiple-plane/"],
        ["Disc type flywheel", "exp/disc-type-flywheel/"],
        ["Rim type flywheel", "exp/rim-type-flywheel/"]
      ] },
    { id: "L8", name: "Machine Dynamics and Vibration", host: "NITK", site: "https://mdmv-nitk.vlabs.ac.in/",
      keywords: "free / forced vibration, absorber",
      exps: [
        ["Free vibration of cantilever beam", "exp/exp-cantilever-beam-nitk/"],
        ["Free vibration of simply supported beam", "exp/exp-simply-supported-beam-nitk/"],
        ["Free vibration of fixed beam", "exp/exp-fixed-beam-nitk/"],
        ["Forced vibration of SDOF system", "exp/exp-sdof-system-nitk/"],
        ["Base excitation", "exp/exp-base-excitation-nitk/"],
        ["Rotating unbalance", "exp/exp-rotating-unbalance-nitk/"],
        ["2DOF forced vibration", "exp/exp-forced-vibration-nitk/"],
        ["Dynamic vibration absorber", "exp/exp-dynamic-vibration-absorber-nitk/"]
      ] },
    { id: "L9", name: "Fluid Mechanics", host: "NITK", site: "https://fm-nitk.vlabs.ac.in/",
      keywords: "notch, jet, pipe friction, venturimeter",
      exps: [
        ["Calibration of V-notch", "exp/calibration-of-v-notch/"],
        ["Calibration of rectangular notch", "exp/calibration-rectangular-notch/"],
        ["Impact of jet", "exp/impact-of-jet/"],
        ["Friction in pipes", "exp/friction-in-pipes/"],
        ["Venturimeter", "exp/venturimeter/"]
      ] },
    { id: "L10", name: "Fluid Mechanics", host: "IITK", site: "https://fm-iitk.vlabs.ac.in/",
      keywords: "Pelton, Francis, Kaplan, pumps, orifice",
      exps: [
        ["Loss variables for flow in pipes and open channels", "exp/open-channels/"],
        ["Characteristic curves of Pelton wheel", "exp/pelton-wheel/"],
        ["Coefficient of discharge of a Venturi meter", "exp/venturi-meter/"],
        ["Variable area duct and Bernoulli's energy equation", "exp/bernoullis-energy-equation/"],
        ["Characteristic curves of Francis turbine", "exp/francis-turbine/"],
        ["Characteristic curves of Kaplan turbine", "exp/kaplan-turbine/"],
        ["Characteristic curves of reciprocating pump", "exp/reciprocating-pump/"],
        ["Characteristic curves of gear pump", "exp/gear-pump/"],
        ["Hydraulic coefficients for flow through an orifice", "exp/orifice/"],
        ["Friction coefficients for pipes of different diameters", "exp/friction-coefficients/"]
      ] },
    { id: "L11", name: "Manufacturing Processes (Foundry and Casting)", host: "DLBG", site: "https://mp-dei.vlabs.ac.in/",
      keywords: "sand casting, pattern, core, sand tests",
      exps: [
        ["Stages of sand casting (demonstration)", "exp/study-observe-stages-casting-sand-casting-process/"],
        ["Design and manufacture of a wooden pattern", "exp/design-manufacture-wooden-pattern-given-casting/"],
        ["Core and core making", "exp/study-core-core-making/"],
        ["Strength tests on sands", "exp/perform-strength-tests-sands/"],
        ["Percentage of clay in base sand", "exp/determine-percentage-clay-present-base-sand/"],
        ["Mould hardness and core hardness", "exp/determination-mould-hardness-core-hardness/"],
        ["Permeability number of green, core and raw sand", "exp/determine-permeability-number-green-sand-core-sand-raw-sand/"],
        ["Steps of investment casting", "exp/study-various-steps-investment-casting-process/"],
        ["Sieve analysis and grain fineness number", "exp/find-distribution-sand-grains-sieves-average-grain-fineness-number/"],
        ["Pattern for lost foam casting", "exp/prepare-pattern-given-object-lost-foam-casting/"]
      ] },
    { id: "L12", name: "Welding", host: "IITKGP", site: "https://wl-iitkgp.vlabs.ac.in/",
      keywords: "SMAW, MIG, TIG, SAW, weld zone",
      exps: [
        ["Types of weld joints and weld positions", "exp/weld-joints/"],
        ["Principles of shielded metal arc welding", "exp/shielded-metal-arc-welding/"],
        ["Effect of welding parameters on the weld bead", "exp/effect-of-welding/"],
        ["Heat flow across the weld bead", "exp/heat-flow-weld-bead/"],
        ["Gas welding and gas cutting", "exp/gas-cutting-processes/"],
        ["Principles of MIG welding", "exp/metal-inert-gas-welding/"],
        ["Principles of TIG welding", "exp/tungsten-inert-gas-welding/"],
        ["Principles of submerged arc welding (SAW)", "exp/submerged-arc-welding/"],
        ["Weld zone evaluation", "exp/weldzone-evaluation/"],
        ["Non-destructive testing (NDT) of welded joint", "exp/ndt-welded-joint/"],
        ["Advanced welding techniques", "exp/advanced-welding-techniques/"]
      ] },
    { id: "L13", name: "Metal Forming I", host: "DLBG", site: "https://msvs1-dei.vlabs.ac.in/",
      keywords: "forging, extrusion, sheet metal",
      exps: [
        ["Upsetting processes", "exp/upsetting-processes/"],
        ["Extrusion processes", "exp/extrusion-processes/"],
        ["Upsetting and extrusion presses", "exp/upsetting-extrusion-presses/"],
        ["Multi-step forging", "exp/multi-step-forging/"],
        ["Hammer forging", "exp/hammer-forging/"],
        ["Orbital forming", "exp/orbital-forming/"],
        ["Hydroforming", "exp/hydro-forming/"],
        ["Stretch forming", "exp/stretch-forming/"],
        ["Sheet metal working", "exp/sheet-metal-working/"],
        ["Ring compression test", "exp/ring-compression-test/"]
      ] },
    { id: "L14", name: "3D Printing", host: "DLBG", site: "https://3dp-dei.vlabs.ac.in/",
      keywords: "FDM, SLA, SLS, printer types",
      exps: [
        ["Anatomy of an FDM 3D printer", "exp/simulation-anatomy-fdm/"],
        ["Cartesian 3D printer", "exp/simulation-cartesian-system/"],
        ["Polar 3D printer", "exp/simulation-of-polar-machine/"],
        ["Delta 3D printer", "exp/simulation-of-delta-machine/"],
        ["Stereolithography (SLA) process", "exp/simulation-stereolithography-process/"],
        ["Fused deposition modelling (FDM) process", "exp/simulation-modelling-process/"],
        ["Selective laser sintering (non-metal)", "exp/simulation-laser-sintering-nonmetal/"],
        ["Selective laser sintering (metal)", "exp/simulation-laser-sintering-metal/"],
        ["Laminated object manufacturing", "exp/simulation-laminated-object/"],
        ["Powder binding / binder jetting", "exp/simulation-powder-binding/"],
        ["Post-processing in additive manufacturing", "exp/simulation-post-processing/"],
        ["Pre-processing in additive manufacturing", "exp/simulation-additive-manufacturing/"]
      ] },
    { id: "L15", name: "Virtual FAB", host: "COEP", site: "https://fab-coep.vlabs.ac.in/",
      keywords: "3D machining, scanning, laser cutting",
      exps: [
        ["Computer controlled cutting of a wooden object", "exp/computer-controlled-cutting/"],
        ["3D machining", "exp/3d-machining/"],
        ["PCB design and fabrication", "exp/pcb-design-fabrication/"],
        ["Digital fabrication of a flexible circuit board", "exp/digital-fabrication/"],
        ["3D scanning", "exp/3d-scanning/"]
      ] },
    { id: "L16", name: "Heat Transfer", host: "NITK", site: "https://ht-nitk.vlabs.ac.in/",
      keywords: "conduction, convection, emissivity, exchangers",
      exps: [
        ["Thermal conductivity of a metal rod", "exp/thermal-conductivity-metal-rod/"],
        ["Thermal conductivity of a liquid", "exp/thermal-conductivity-liquid/"],
        ["Thermal conductivity of insulating material", "exp/thermal-conductivity-insulating-material/"],
        ["Heat transfer through a composite wall", "exp/composite-wall/"],
        ["Heat transfer coefficient in natural convection", "exp/natural-convection/"],
        ["Critical heat flux", "exp/critical-heat-flux/"],
        ["Emissivity of a surface", "exp/emissivity-of-surface/"],
        ["Stefan-Boltzmann constant", "exp/stefan-boltzmann-constant/"],
        ["Heat transfer coefficient in forced convection", "exp/forced-convection/"],
        ["Heat exchangers", "exp/heat-exchangers/"]
      ] },
    { id: "SAR", name: "Experiments listed in SAR 2.2.3 B", host: "NITK", site: "https://fmc-nitk.vlabs.ac.in/",
      keywords: "centrifugal pump, reciprocating pump, Reynolds",
      note: "Extra FMHM experiments named in the SAR (other lab sites).",
      exps: [
        ["Centrifugal pump test (BIS)", "https://fmc-nitk.vlabs.ac.in/exp/centrifugal-pump"],
        ["Reciprocating pump test (BIS)", "https://fmc-nitk.vlabs.ac.in/exp/reciprocating-pump"],
        ["Reynolds experiment", "https://eerc03-iiith.vlabs.ac.in/exp/reynolds"]
      ] }
  ],

  /* Course to lab mapping, as in the eligible-student register. "support" = supporting lab only. */
  courses: [
    { sem: 1, name: "Engineering Graphics", labs: ["L1"] },
    { sem: 1, name: "Engineering Materials Science", labs: ["L2"], support: true },
    { sem: 2, name: "Mechanical Drafting", labs: ["L1"], support: true },
    { sem: 3, name: "Basics of Applied Mechanics", labs: ["L3", "L2"] },
    { sem: 3, name: "Theory of Machines and Mechanisms", labs: ["L4", "L5", "L6"] },
    { sem: 3, name: "Fluid Mechanics and Hydraulic Machinery", labs: ["L9", "L10", "SAR"] },
    { sem: 3, name: "Manufacturing Engineering-I", labs: ["L11", "L12"] },
    { sem: 4, name: "Robotics, Automation and 3D Modeling", labs: ["L6", "L14"] },
    { sem: 4, name: "Manufacturing Engineering-II", labs: ["L11", "L12"] },
    { sem: 4, name: "Design of Machine Elements", labs: ["L7", "L8"], support: true },
    { sem: 5, name: "Manufacturing Engineering-III", labs: ["L11", "L12", "L13"] },
    { sem: 5, name: "Tool Engineering", labs: ["L13"] },
    { sem: 5, name: "Thermal Engineering-II", labs: ["L16"], note: "Use only if heat transfer is in the GTU syllabus." },
    { sem: 6, name: "CAD/CAM", labs: ["L14", "L15"] },
    { sem: 6, name: "Fabrication Technology", labs: ["L11", "L12"] },
    { sem: 6, name: "Design of Machine Elements", labs: ["L7", "L8"], support: true }
  ],

  gaps: [
    "No confirmed virtual lab yet for Engineering Thermodynamics, Thermal Engineering-I (IC engines, boilers), Design of Machine Elements (main lab) and Measurements and Metrology.",
    "Heat Transfer (L16) maps to Thermal Engineering-II only if heat transfer is in the GTU syllabus.",
    "A page that opens does not prove the experiment runs. Each faculty member runs one experiment of each lab before class use.",
    "Semester 1 Communication, Chemistry and Physics: no virtual lab link given in the SAR yet."
  ],

  tools: [
    ["PhET (Univ. of Colorado)", "Physics, heat and energy concepts", "https://phet.colorado.edu/"],
    ["OpenModelica", "Dynamics and thermo-fluid simulation", "https://openmodelica.org/"],
    ["LibreCAD", "2D drafting", "https://librecad.org/"],
    ["OpenSCAD", "Script-based 3D modelling", "https://openscad.org/"],
    ["Onshape Education", "Browser 3D CAD", "https://www.onshape.com/en/education/"],
    ["Tinkercad", "Browser 3D modelling", "https://www.tinkercad.com/"],
    ["SimScale", "CFD and heat-transfer simulation (free tier)", "https://www.simscale.com/"],
    ["NPTEL", "Video lectures", "https://nptel.ac.in/"]
  ]
};
