// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   User,
//   Users,
//   HeartPulse,
//     Pencil,
//   Plus,
//   CalendarClock,
//   UploadCloud,
//   FileText,
//   Trash2,
//   Pill,
//    Camera,
// } from "lucide-react";
// import { useData } from "../../../context/DataContext.jsx";
// import "./AddClient.css"; // adjust path if your AddClient folder lives elsewhere

// const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Tea", "Supper"];
// const WEEKDAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// const RELIGIONS = [
//   "No religion",
//   "Christian",
//   "Buddhist",
//   "Hindu",
//   "Jewish",
//   "Muslim",
//   "Sikh",
//   "Other religion",
//   "Prefer not to say",
// ];

// const ETHNICITIES = [
//   "White British",
//   "White Irish",
//   "White - Other",
//   "Mixed / Multiple ethnic groups",
//   "Asian / Asian British - Indian",
//   "Asian / Asian British - Pakistani",
//   "Asian / Asian British - Bangladeshi",
//   "Asian / Asian British - Chinese",
//   "Asian / Asian British - Other",
//   "Black / African / Caribbean / Black British",
//   "Other ethnic group",
//   "Prefer not to say",
// ];

// const UK_REGIONS = [
//   "North East England",
//   "North West England",
//   "Yorkshire and the Humber",
//   "East Midlands",
//   "West Midlands",
//   "East of England",
//   "Greater London",
//   "South East England",
//   "South West England",
//   "Wales",
//   "Scotland",
//   "Northern Ireland",
// ];

// function makeId() {
//   return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
// }

// // Convert an ISO date string / Date to yyyy-mm-dd for <input type="date">
// function toDateInputValue(value) {
//   if (!value) return "";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toISOString().slice(0, 10);
// }
// function getInitials(name = "") {
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// function resizeImage(file, max = 256) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onerror = reject;
//     reader.onload = () => {
//       const img = new Image();
//       img.onerror = reject;
//       img.onload = () => {
//         const scale = Math.min(1, max / Math.max(img.width, img.height));
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.round(img.width * scale);
//         canvas.height = Math.round(img.height * scale);
//         canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
//         resolve(canvas.toDataURL("image/jpeg", 0.8));
//       };
//       img.src = reader.result;
//     };
//     reader.readAsDataURL(file);
//   });
// }
// function EditClient() {
//   const nav = useNavigate();
//   const { id } = useParams();
//   const { data, getClient, updateClient } = useData();

//   const [values, setValues] = useState(null); // null while loading
//   const [documents, setDocuments] = useState([]); // pre-existing, from DB
//   const [newDocuments, setNewDocuments] = useState([]); // freshly added this session
//   const [medications, setMedications] = useState([]);
//   const [meals, setMeals] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [clientDbId, setClientDbId] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         // Prefer whatever's already in context (avoids an extra request),
//         // fall back to a direct fetch by id.
//         let client =
//           data.clients.find((c) => c.clientId === id) ||
//           data.clients.find((c) => c._id === id);

//         if (!client) {
//           client = await getClient(id);
//         }

//         if (!client) {
//           setError("Client not found.");
//           setLoading(false);
//           return;
//         }

//         setClientDbId(client._id);

//         setValues({
//           name: client.fullName || "",
//           email: client.email || "",
//           phone: client.phone || "",
//           keySafeCode: client.keySafeCode || "",
//           localAuthorityNo: client.localAuthorityNo || "",
//           dateOfBirth: toDateInputValue(client.dateOfBirth),
//           address: client.address || "",
//           postCode: client.postCode || "",
//           region: client.region || "",
//           pronoun: client.pronoun || "",
//           maritalStatus: client.maritalStatus || "",
//           religion: client.religion || "",
//           ethnicity: client.ethnicity || "",
//           sex: client.gender || "",
//           communicationPreference: client.communicationPreference || "",
//           familyMemberName: client.emergencyContact?.familyMemberName || "",
//           relationship: client.emergencyContact?.relationship || "",
//           nextOfKinName: client.emergencyContact?.nextOfKinName || "",
//           nextOfKinPhone: client.emergencyContact?.nextOfKinPhone || "",
//           medicalHistory: client.medicalHistory || "",
//           allergies: client.allergies || "",
//           favouriteActivities: client.favoriteActivities || "",
//           dailyCare: {
//             bedtime: client.dailyCare?.bedtime || "",
//             bathTime: client.dailyCare?.bathTime || "",
//           },
//           profilePhoto: client.profilePhoto || "",
//         });

//         setMeals(
//           (client.foodIntake || []).map((m) => ({
//             id: m._id || makeId(),
//             type: m.mealType || "",
//             description: m.mealDescription || "",
//             time: m.mealTime || "",
//             day: m.mealDay || "Monday",
//           }))
//         );

//         setMedications(
//           (client.medications || []).map((m) => ({
//             id: m._id || makeId(),
//             name: m.name || "",
//             dosage: m.dosage || "",
//             time: m.time || "",
//             date: toDateInputValue(m.date),
//             instructions: m.instructions || "",
//           }))
//         );

//         setDocuments(client.documents || []);
//       } catch (err) {
//         setError(err.message || "Failed to load client.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const update = (field, value) => {
//     setValues((v) => ({ ...v, [field]: value }));
//   };

//   const updateNested = (section, field, value) => {
//     setValues((v) => ({ ...v, [section]: { ...v[section], [field]: value } }));
//   };
// const handlePhoto = async (file) => {
//   if (!file) return;
//   try {
//     const dataUrl = await resizeImage(file);
//     update("profilePhoto", dataUrl);
//   } catch {
//     setError("Could not read that image. Please try another file.");
//   }
// };
//   // ---------- New documents (uploaded during this edit) ----------
//   const handleFiles = (fileList) => {
//     const files = Array.from(fileList || []);
//     if (!files.length) return;
//     const next = files.map((file) => ({
//       id: makeId(),
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));
//     setNewDocuments((docs) => [...docs, ...next]);
//   };

//   const removeNewDocument = (docId) => {
//     setNewDocuments((docs) => {
//       const target = docs.find((d) => d.id === docId);
//       if (target) URL.revokeObjectURL(target.url);
//       return docs.filter((d) => d.id !== docId);
//     });
//   };

//   const removeExistingDocument = (docId) => {
//     setDocuments((docs) => docs.filter((d) => (d._id || d.id) !== docId));
//   };

//   // ---------- Medications ----------
//   const addMedication = () => {
//     setMedications((meds) => [
//       ...meds,
//       { id: makeId(), name: "", dosage: "", time: "", date: "", instructions: "" },
//     ]);
//   };

//   const updateMedication = (medId, field, value) => {
//     setMedications((meds) =>
//       meds.map((m) => (m.id === medId ? { ...m, [field]: value } : m))
//     );
//   };

//   const removeMedication = (medId) => {
//     setMedications((meds) => meds.filter((m) => m.id !== medId));
//   };

//   // ---------- Meals ----------
//   const addMeal = () => {
//     setMeals((m) => [
//       ...m,
//       { id: makeId(), type: "", description: "", time: "", day: "Monday" },
//     ]);
//   };

//   const updateMeal = (mealId, field, value) => {
//     setMeals((m) => m.map((meal) => (meal.id === mealId ? { ...meal, [field]: value } : meal)));
//   };

//   const removeMeal = (mealId) => {
//     setMeals((m) => m.filter((meal) => meal.id !== mealId));
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!values.name.trim() || !values.email.trim() || !values.phone.trim()) {
//       setError("Full name, email address, and phone number are required.");
//       return;
//     }
//     if (!values.nextOfKinName.trim() || !values.nextOfKinPhone.trim()) {
//       setError("Next of kin name and phone number are required.");
//       return;
//     }
//     setError("");

//     // NOTE: newDocuments here are still local blob: URLs. If you have an
//     // upload endpoint (e.g. S3), upload them first and swap in the real
//     // fileUrl before sending this payload — see the note below the code.
//     const payload = {
//       fullName: values.name,
//       email: values.email,
//       phone: values.phone,
//       keySafeCode: values.keySafeCode,
//       localAuthorityNo: values.localAuthorityNo.trim() || null,
//       dateOfBirth: values.dateOfBirth || undefined,
//       address: values.address,
//       postCode: values.postCode,
//       region: values.region,
//       maritalStatus: values.maritalStatus,
//       religion: values.religion,
//       ethnicity: values.ethnicity || undefined,
//       gender: values.sex === "Other" ? undefined : values.sex,
//       communicationPreference: values.communicationPreference,
//       medicalHistory: values.medicalHistory,
//       allergies: values.allergies,
//       pronoun: values.pronoun,
//       favoriteActivities: values.favouriteActivities,
//       dailyCare: values.dailyCare,
//       emergencyContact: {
//         familyMemberName: values.familyMemberName,
//         relationship: values.relationship,
//         nextOfKinName: values.nextOfKinName,
//         nextOfKinPhone: values.nextOfKinPhone,
//       },
//       profilePhoto: values.profilePhoto,
//       foodIntake: meals
//         .filter((m) => m.type)
//         .map(({ type, description, time, day }) => ({
//           mealType: type,
//           mealDescription: description,
//           mealTime: time,
//           mealDay: day,
//         })),
//       medications: medications
//         .filter((m) => m.name.trim())
//         .map(({ id, ...rest }) => rest),
//       // documents: [
//       //   ...documents.map(({ fileName, fileUrl }) => ({ fileName, fileUrl })),
//       //   ...newDocuments.map((d) => ({ fileName: d.name, fileUrl: d.url })),
//       // ],
//            documents: [...documents],
//     };

//     try {
//       setSubmitting(true);
//       await updateClient(clientDbId, payload);
//       nav(`/admin/client-profile/${id}`);
//     } catch (err) {
//       setError(err.message || "Failed to update client.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="add-client-page">
//         <p>Loading client...</p>
//       </div>
//     );
//   }

//   if (error && !values) {
//     return (
//       <div className="add-client-page">
//         <div className="form-error">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="add-client-page">
//       <div className="page-head">
//         <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back">
//           <ArrowLeft size={18} />
//         </button>
//         <div>
//           <div className="eyebrow">LANBETHCARE</div>
//           <h1>Edit Client</h1>
//           <p>Update this client's profile and care record.</p>
//         </div>
//       </div>

//       <form className="client-form" onSubmit={submit}>
//         <FormSection
//           icon={<User size={16} />}
//           title="Personal Information"
//           desc="Core identity and contact details for this client."
//         >

//           <div className="photo-upload">
//   <div className="photo-circle">
//     {values.profilePhoto ? (
//       <img src={values.profilePhoto} alt={values.name || "Client"} />
//     ) : (
//       <span>{getInitials(values.name) || <Camera size={22} />}</span>
//     )}
//   </div>
//   <div className="photo-actions">
//     <label className="outline small photo-btn">
//       <Camera size={14} />
//       {values.profilePhoto ? "Change Photo" : "Upload Photo"}
//       <input
//         type="file"
//         accept="image/*"
//         hidden
//         onChange={(e) => handlePhoto(e.target.files[0])}
//       />
//     </label>
//     {values.profilePhoto && (
//       <button
//         type="button"
//         className="medication-remove"
//         onClick={() => update("profilePhoto", "")}
//       >
//         <Trash2 size={13} /> Remove
//       </button>
//     )}
//     <small className="field-hint">JPG or PNG. It is resized automatically.</small>
//   </div>
// </div>
//           <div className="form-grid">
//             <Field label="Full Name" required>
//               <input value={values.name} onChange={(e) => update("name", e.target.value)} />
//             </Field>
//             <Field label="Email Address" required>
//               <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} />
//             </Field>
//             <Field label="Phone Number" required>
//               <input value={values.phone} onChange={(e) => update("phone", e.target.value)} />
//             </Field>
//             <Field label="Key Safe Code">
//               <input value={values.keySafeCode} onChange={(e) => update("keySafeCode", e.target.value)} />
//             </Field>
//             <Field label="Local Authority ID No.">
//   <input
//     value={values.localAuthorityNo}
//     onChange={(e) => update("localAuthorityNo", e.target.value)}
//     placeholder="e.g. LA-2026-00123"
//   />
// </Field>
//             <Field label="Date of Birth" required>
//               <input type="date" value={values.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
//             </Field>
//             <Field label="Sex" required>
//               <select value={values.sex} onChange={(e) => update("sex", e.target.value)}>
//                 <option value="">Select...</option>
//                 <option value="Female">Female</option>
//                 <option value="Male">Male</option>
//                 <option value="Other">Other</option>
//               </select>
//             </Field>
//             <Field label="pronoun">
//   <select value={values.pronoun} onChange={(e) => update("pronoun", e.target.value)}>
//     <option value="">Select...</option>
//     <option value="He">He</option>
//     <option value="She">She</option>
//     <option value="They">They</option>
//   </select>
// </Field>
//             <Field label="Address" wide required>
//               <input value={values.address} onChange={(e) => update("address", e.target.value)} />
//             </Field>
//             <Field label="Post Code" required>
//               <input value={values.postCode} onChange={(e) => update("postCode", e.target.value)} />
//             </Field>
//             <Field label="Region" required>
//               <select value={values.region} onChange={(e) => update("region", e.target.value)}>
//                 <option value="">Select...</option>
//                 {UK_REGIONS.map((r) => (
//                   <option key={r}>{r}</option>
//                 ))}
//               </select>
//             </Field>
//             <Field label="Marital Status">
//               <select value={values.maritalStatus} onChange={(e) => update("maritalStatus", e.target.value)}>
//                 <option value="">Select...</option>
//                 <option>Single</option>
//                 <option>Married</option>
//                 <option>Widowed</option>
//                 <option>Divorced</option>
//               </select>
//             </Field>
//             <Field label="Religion" required>
//               <select value={values.religion} onChange={(e) => update("religion", e.target.value)}>
//                 <option value="">Select...</option>
//                 {RELIGIONS.map((r) => (
//                   <option key={r}>{r}</option>
//                 ))}
//               </select>
//             </Field>
//             <Field label="Ethnicity" hint="Optional">
//               <select value={values.ethnicity} onChange={(e) => update("ethnicity", e.target.value)}>
//                 <option value="">Select... (optional)</option>
//                 {ETHNICITIES.map((e2) => (
//                   <option key={e2}>{e2}</option>
//                 ))}
//               </select>
//             </Field>
//             <Field label="Communication Preference" wide>
//               <input
//                 value={values.communicationPreference}
//                 onChange={(e) => update("communicationPreference", e.target.value)}
//               />
//             </Field>
//           </div>
//         </FormSection>

//         <FormSection
//           icon={<Users size={16} />}
//           title="Family & Emergency Contacts"
//           desc="Who to reach in the event of an emergency."
//         >
//           <div className="form-grid">
//             <Field label="Family Member Name">
//               <input value={values.familyMemberName} onChange={(e) => update("familyMemberName", e.target.value)} />
//             </Field>
//             <Field label="Relationship">
//               <input value={values.relationship} onChange={(e) => update("relationship", e.target.value)} />
//             </Field>
//             <Field label="Next of Kin Name" required>
//               <input value={values.nextOfKinName} onChange={(e) => update("nextOfKinName", e.target.value)} />
//             </Field>
//             <Field label="Next of Kin Phone" required>
//               <input value={values.nextOfKinPhone} onChange={(e) => update("nextOfKinPhone", e.target.value)} />
//             </Field>
//           </div>
//         </FormSection>

//         <FormSection
//           icon={<HeartPulse size={16} />}
//           title="Medical Information"
//           desc="A brief history and any known allergies the care team should be aware of."
//         >
//           <div className="form-grid">
//             <Field label="Medical History" wide>
//               <textarea rows={4} value={values.medicalHistory} onChange={(e) => update("medicalHistory", e.target.value)} />
//             </Field>
//             <Field label="Allergies" wide hint="Separate multiple allergies with commas">
//               <input value={values.allergies} onChange={(e) => update("allergies", e.target.value)} />
//             </Field>
//           </div>
//         </FormSection>

//         <FormSection
//           icon={<CalendarClock size={16} />}
//           title="Daily Care & Nutrition"
//           desc="Routine, meal plan, and the activities this client enjoys."
//         >
//           <div className="form-subhead">Daily Care Schedule</div>
//           <div className="form-grid">
//             <Field label="Bedtime">
//               <input type="time" value={values.dailyCare.bedtime} onChange={(e) => updateNested("dailyCare", "bedtime", e.target.value)} />
//             </Field>
//             <Field label="Bath Time">
//               <input type="time" value={values.dailyCare.bathTime} onChange={(e) => updateNested("dailyCare", "bathTime", e.target.value)} />
//             </Field>
//           </div>

//           <div className="form-subhead">Current Food Intake Plan</div>

//           {meals.length === 0 && (
//             <p className="section-empty">No meals added yet. Add one entry per meal (breakfast, lunch, etc).</p>
//           )}

//           {meals.map((meal) => (
//             <div className="medication-row" key={meal.id}>
//               <div className="form-grid">
//                 <Field label="Meal Type">
//                   <select value={meal.type} onChange={(e) => updateMeal(meal.id, "type", e.target.value)}>
//                     <option value="">Select...</option>
//                     {MEAL_TYPES.map((m) => (
//                       <option key={m}>{m}</option>
//                     ))}
//                   </select>
//                 </Field>
//                 <Field label="Meal Description">
//                   <input value={meal.description} onChange={(e) => updateMeal(meal.id, "description", e.target.value)} />
//                 </Field>
//                 <Field label="Meal Time">
//                   <input type="time" value={meal.time} onChange={(e) => updateMeal(meal.id, "time", e.target.value)} />
//                 </Field>
//                 <Field label="Day">
//                   <select value={meal.day} onChange={(e) => updateMeal(meal.id, "day", e.target.value)}>
//                     {WEEKDAYS.map((d) => (
//                       <option key={d}>{d}</option>
//                     ))}
//                   </select>
//                 </Field>
//               </div>
//               <button type="button" className="medication-remove" onClick={() => removeMeal(meal.id)}>
//                 <Trash2 size={13} />
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button type="button" className="outline small" onClick={addMeal}>
//             <Plus size={14} />
//             Add Meal Entry
//           </button>

//           <div className="form-subhead" style={{ marginTop: 24 }}>Favourite Activities</div>
//           <div className="form-grid">
//             <Field label="Activities" wide>
//               <input value={values.favouriteActivities} onChange={(e) => update("favouriteActivities", e.target.value)} />
//             </Field>
//           </div>
//         </FormSection>

//         <FormSection
//           icon={<UploadCloud size={16} />}
//           title="Documents"
//           desc="Existing files, plus anything new you'd like to add."
//         >
//           <label className="upload-drop">
//             <UploadCloud size={18} />
//             <span>
//               <b>Click to browse</b> or drag a file in
//             </span>
//             <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
//           </label>

//           {(documents.length > 0 || newDocuments.length > 0) && (
//             <div className="upload-list">
//               {documents.map((doc) => (
//                 <div className="upload-row" key={doc._id || doc.fileUrl}>
//                   <FileText size={15} />
//                   <span className="upload-name">{doc.fileName}</span>
//                   <a href={doc.fileUrl} target="_blank" rel="noreferrer">
//                     View
//                   </a>
//                   <button
//                     type="button"
//                     className="upload-remove"
//                     onClick={() => removeExistingDocument(doc._id)}
//                     aria-label={`Remove ${doc.fileName}`}
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               ))}
//               {newDocuments.map((doc) => (
//                 <div className="upload-row" key={doc.id}>
//                   <FileText size={15} />
//                   <span className="upload-name">{doc.name} (new)</span>
//                   <a href={doc.url} target="_blank" rel="noreferrer">
//                     View
//                   </a>
//                   <button
//                     type="button"
//                     className="upload-remove"
//                     onClick={() => removeNewDocument(doc.id)}
//                     aria-label={`Remove ${doc.name}`}
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </FormSection>

//         <FormSection
//           icon={<Pill size={16} />}
//           title="Medication Schedule"
//           desc="Optional — add, edit, or remove medications for this client."
//         >
//           {medications.length === 0 && <p className="section-empty">No medications added yet.</p>}

//           {medications.map((med) => (
//             <div className="medication-row" key={med.id}>
//               <div className="form-grid">
//                 <Field label="Medication Name">
//                   <input value={med.name} onChange={(e) => updateMedication(med.id, "name", e.target.value)} />
//                 </Field>
//                 <Field label="Dosage">
//                   <input value={med.dosage} onChange={(e) => updateMedication(med.id, "dosage", e.target.value)} />
//                 </Field>
//                 <Field label="Time">
//                   <input type="time" value={med.time} onChange={(e) => updateMedication(med.id, "time", e.target.value)} />
//                 </Field>
//                 <Field label="Date">
//                   <input type="date" value={med.date} onChange={(e) => updateMedication(med.id, "date", e.target.value)} />
//                 </Field>
//                 <Field label="Instructions" wide>
//                   <input value={med.instructions} onChange={(e) => updateMedication(med.id, "instructions", e.target.value)} />
//                 </Field>
//               </div>
//               <button type="button" className="medication-remove" onClick={() => removeMedication(med.id)}>
//                 <Trash2 size={13} />
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button type="button" className="outline small" onClick={addMedication}>
//             <Plus size={14} />
//             Add Another Medication
//           </button>
//         </FormSection>

//         {error && <div className="form-error">{error}</div>}

//         <div className="form-actions">
//           <button type="button" className="outline" onClick={() => nav(-1)} disabled={submitting}>
//             Cancel
//           </button>
//           <button type="submit" className="primary" disabled={submitting}>
//             <Pencil size={15} />
//             {submitting ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function FormSection({ icon, title, desc, children }) {
//   return (
//     <section className="form-section">
//       <div className="form-section-head">
//         <span className="form-section-icon">{icon}</span>
//         <div>
//           <h2>{title}</h2>
//           {desc && <p>{desc}</p>}
//         </div>
//       </div>
//       {children}
//     </section>
//   );
// }

// function Field({ label, required, wide, hint, children }) {
//   return (
//     <label className={`field ${wide ? "wide" : ""}`}>
//       <span>
//         {label}
//         {required && <em>*</em>}
//       </span>
//       {children}
//       {hint && <small className="field-hint">{hint}</small>}
//     </label>
//   );
// }

// export default EditClient;
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, User, Users, HeartPulse, Pencil, Plus, CalendarClock, UploadCloud,
  FileText, Trash2, Pill, Camera, ClipboardList, Landmark, Stethoscope,
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import {
  SEXUALITY_OPTIONS, DNAR_OPTIONS, OXYGEN_OPTIONS,
  TEAM_INVOLVEMENT_OPTIONS, DOCUMENT_VIEWERS, buildLanguageOptions, mergeOptions
} from "./clientFormOptions.js";
import "./AddClient.css";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Tea", "Supper"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LANGUAGES = [
  "English", "Welsh", "Polish", "Punjabi", "Urdu", "Bengali", "Gujarati", "Hindi", "Arabic",
  "French", "Portuguese", "Spanish", "Yoruba", "Igbo", "Twi", "Somali", "Chinese (Mandarin)",
  "Chinese (Cantonese)", "British Sign Language (BSL)", "Other",
];
const RELIGIONS = [
  "No religion", "Christian", "Buddhist", "Hindu", "Jewish", "Muslim", "Sikh",
  "Other religion", "Prefer not to say",
];
const ETHNICITIES = [
  "White British", "White Irish", "White - Other", "Mixed / Multiple ethnic groups",
  "Asian / Asian British - Indian", "Asian / Asian British - Pakistani",
  "Asian / Asian British - Bangladeshi", "Asian / Asian British - Chinese",
  "Asian / Asian British - Other", "Black / African / Caribbean / Black British",
  "Other ethnic group", "Prefer not to say",
];
const UK_REGIONS = [
  "North East England", "North West England", "Yorkshire and the Humber", "East Midlands",
  "West Midlands", "East of England", "Greater London", "South East England",
  "South West England", "Wales", "Scotland", "Northern Ireland",
];
const PROFESSIONAL_TYPES = [
  "Dentist", "Social Worker", "GP", "Pharmacy", "Optician", "Health Care Assessment",
  "Placing Local Authority", "College / University", "Training / College / Personal Tutor",
];
const REGISTERED_TYPES = ["Dentist", "GP", "Pharmacy", "Optician"];
const DOCUMENT_TYPES = [
  "Care Plan", "Identity Document", "Medical Record", "Medication Record", "Assessment",
  "Support Plan", "Consent Form", "Risk Assessment", "Training Record", "Other",
];
const ADMISSION_FIELDS = [
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "banding", label: "Banding" },
  { key: "authorityCategory", label: "Authority / Category" },
  { key: "funeralArrangements", label: "Funeral Arrangements" },
  { key: "funeralDirector", label: "Funeral Director" },
  { key: "team", label: "Team" },
  { key: "defaultShiftRun", label: "Default Shift Run" },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Converts an ISO date to yyyy-mm-dd for <input type="date">
function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function resizeImage(file, max = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function EditClient() {
  const nav = useNavigate();
  const { id } = useParams();
  const { data, getClient, updateClient } = useData();

  const [values, setValues] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);

const savedLanguages = (data?.clients || []).flatMap((c) => c.languages || []);
const languageOptions = buildLanguageOptions([...savedLanguages, ...customLanguages]);

const addCustomLanguage = (rowId, typed) => {
  const name = (typed || "").trim();
  if (!name) {
    setError("Type the language name first.");
    return;
  }
  const existing = languageOptions.find((l) => l.toLowerCase() === name.toLowerCase());
  const finalName = existing && existing !== "Other" ? existing : name;

  if (!languageOptions.includes(finalName)) {
    setCustomLanguages((list) => [...list, finalName]);
  }
  updateLanguage(rowId, "value", finalName);
  setError("");
};
  const [admission, setAdmission] = useState({ extraFields: [] });
  const [newFieldName, setNewFieldName] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [meals, setMeals] = useState([]);
  const [documents, setDocuments] = useState([]); // existing, from the database
  const [newDocs, setNewDocs] = useState([]);     // added in this edit session
  const [clientDbId, setClientDbId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let client =
          data.clients.find((c) => c.clientId === id) ||
          data.clients.find((c) => c._id === id);
        if (!client) client = await getClient(id);
        if (!client) {
          setError("Client not found.");
          return;
        }

        setClientDbId(client._id);

        const a = client.admission || {};
        setAdmission({
          startDate: toDateInputValue(a.startDate),
          banding: a.banding || "",
          authorityCategory: a.authorityCategory || "",
          funeralArrangements: a.funeralArrangements || "",
          funeralDirector: a.funeralDirector || "",
          team: a.team || "",
          defaultShiftRun: a.defaultShiftRun || "",
          extraFields: (a.extraFields || []).map((f) => ({
            id: makeId(),
            label: f.label,
            value: f.value || "",
          })),
        });

        setLanguages(
          client.languages?.length
            ? client.languages.map((l) =>
                LANGUAGES.includes(l)
                  ? { id: makeId(), value: l, other: "" }
                  : { id: makeId(), value: "Other", other: l }
              )
            : [{ id: makeId(), value: "", other: "" }]
        );

        setProfessionals(
          (client.professionals || []).map((p) => ({
            id: makeId(),
            role: p.role || "",
            name: p.name || "",
            phone: p.phone || "",
            email: p.email || "",
            address: p.address || "",
            postCode: p.postCode || "",
            registeredDate: toDateInputValue(p.registeredDate),
          }))
        );

        setValues({
          name: client.fullName || "",
          email: client.email || "",
          phone: client.phone || "",
          keySafeCode: client.keySafeCode || "",
          localAuthorityNo: client.localAuthorityNo || "",
          dateOfBirth: toDateInputValue(client.dateOfBirth),
          address: client.address || "",
          postCode: client.postCode || "",
          region: client.region || "",
          maritalStatus: client.maritalStatus || "",
          religion: client.religion || "",
          ethnicity: client.ethnicity || "",
          sex: client.gender || "",
          pronoun: client.pronoun || "",
          sexuality: client.sexuality || "",
          nhsNumber: client.nhsNumber || "",
          chiNumber: client.chiNumber || "",
          niNumber: client.niNumber || "",
          familyMemberName: client.emergencyContact?.familyMemberName || "",
          relationship: client.emergencyContact?.relationship || "",
          nextOfKinName: client.emergencyContact?.nextOfKinName || "",
          nextOfKinPhone: client.emergencyContact?.nextOfKinPhone || "",
          emergencyEmails: client.emergencyContact?.emails?.length ? client.emergencyContact.emails : [""],
          emergencyAddresses: client.emergencyContact?.addresses?.length ? client.emergencyContact.addresses : [""],
          councilServiceUserId: client.councilServiceUserId || "",
          councilCareProviderId: client.councilCareProviderId || "",
          serviceType: client.serviceType || "",
          serviceLevel: client.serviceLevel || "",
          medicalHistory: client.medicalHistory || "",
          allergies: client.allergies || "",
          dnar: client.dnar || "",
          oxygen: client.medicalHealth?.oxygen || "",
          onCatheter: client.medicalHealth?.onCatheter ? "Yes" : "No",
          teamInvolvement: client.medicalHealth?.teamInvolvement || [],
          favouriteActivities: client.favoriteActivities || "",
          dailyCare: {
            bedtime: client.dailyCare?.bedtime || "",
            bathTime: client.dailyCare?.bathTime || "",
          },
          profilePhoto: client.profilePhoto || "",
        });
setCustomTeam(client.medicalHealth?.teamInvolvement || []);

setHealthFields(
  (client.medicalHealth?.customFields || []).map((f) => ({
    id: makeId(),
    label: f.label,
    value: f.value || "",
  }))
);
        setMeals(
          (client.foodIntake || []).map((m) => ({
            id: m._id || makeId(),
            type: m.mealType || "",
            description: m.mealDescription || "",
            time: m.mealTime || "",
            day: m.mealDay || "Monday",
          }))
        );

        setMedications(
          (client.medications || []).map((m) => ({
            id: m._id || makeId(),
            name: m.name || "",
            dosage: m.dosage || "",
            time: m.time || "",
            date: toDateInputValue(m.date),
            instructions: m.instructions || "",
          }))
        );

        setDocuments(client.documents || []);
      } catch (err) {
        setError(err.message || "Failed to load client.");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Generic helpers ----------
  const update = (field, value) => setValues((v) => ({ ...v, [field]: value }));

  const updateNested = (section, field, value) =>
    setValues((v) => ({ ...v, [section]: { ...v[section], [field]: value } }));

  const updateListItem = (key, index, value) =>
    setValues((v) => ({ ...v, [key]: v[key].map((x, i) => (i === index ? value : x)) }));

  const addListItem = (key) => setValues((v) => ({ ...v, [key]: [...v[key], ""] }));

  const removeListItem = (key, index) =>
    setValues((v) => ({ ...v, [key]: v[key].filter((_, i) => i !== index) }));

  const toggleTeam = (item) =>
    setValues((v) => ({
      ...v,
      teamInvolvement: v.teamInvolvement.includes(item)
        ? v.teamInvolvement.filter((x) => x !== item)
        : [...v.teamInvolvement, item],
    }));

  const handlePhoto = async (file) => {
    if (!file) return;
    try {
      update("profilePhoto", await resizeImage(file));
    } catch {
      setError("Could not read that image. Please try another file.");
    }
  };

  // ---------- Languages ----------
  const updateLanguage = (lid, field, value) =>
    setLanguages((list) => list.map((l) => (l.id === lid ? { ...l, [field]: value } : l)));
  const addLanguage = () =>
    setLanguages((list) => [...list, { id: makeId(), value: "", other: "" }]);
  const removeLanguage = (lid) => setLanguages((list) => list.filter((l) => l.id !== lid));

  // ---------- Admission ----------
  const updateAdmission = (field, value) => setAdmission((a) => ({ ...a, [field]: value }));

  const addAdmissionField = () => {
    const label = newFieldName.trim();
    if (!label) {
      setFieldError("Type a name for the new field first.");
      return;
    }
    const taken = [
      ...ADMISSION_FIELDS.map((f) => f.label),
      ...(admission.extraFields || []).map((f) => f.label),
    ].map((n) => n.toLowerCase());
    if (taken.includes(label.toLowerCase())) {
      setFieldError(`A field called "${label}" already exists.`);
      return;
    }
    setAdmission((a) => ({
      ...a,
      extraFields: [...(a.extraFields || []), { id: makeId(), label, value: "" }],
    }));
    setNewFieldName("");
    setFieldError("");
  };

  const updateAdmissionField = (fid, value) =>
    setAdmission((a) => ({
      ...a,
      extraFields: a.extraFields.map((f) => (f.id === fid ? { ...f, value } : f)),
    }));

  const removeAdmissionField = (fid) =>
    setAdmission((a) => ({ ...a, extraFields: a.extraFields.filter((f) => f.id !== fid) }));

  // ---------- Professionals ----------
  const addProfessional = () =>
    setProfessionals((p) => [
      ...p,
      { id: makeId(), role: "", name: "", phone: "", email: "", address: "", postCode: "", registeredDate: "" },
    ]);
  const updateProfessional = (pid, field, value) =>
    setProfessionals((p) => p.map((x) => (x.id === pid ? { ...x, [field]: value } : x)));
  const removeProfessional = (pid) => setProfessionals((p) => p.filter((x) => x.id !== pid));

  // ---------- Medications ----------
  const addMedication = () =>
    setMedications((m) => [...m, { id: makeId(), name: "", dosage: "", time: "", date: "", instructions: "" }]);
  const updateMedication = (mid, field, value) =>
    setMedications((m) => m.map((x) => (x.id === mid ? { ...x, [field]: value } : x)));
  const removeMedication = (mid) => setMedications((m) => m.filter((x) => x.id !== mid));

  // ---------- Meals ----------
  const addMeal = () =>
    setMeals((m) => [...m, { id: makeId(), type: "", description: "", time: "", day: "Monday" }]);
  const updateMeal = (mid, field, value) =>
    setMeals((m) => m.map((x) => (x.id === mid ? { ...x, [field]: value } : x)));
  const removeMeal = (mid) => setMeals((m) => m.filter((x) => x.id !== mid));

  // ---------- Documents ----------
  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const next = files.map((file) => ({
      id: makeId(),
      file,
      name: file.name,
      title: file.name.replace(/\.[^/.]+$/, ""),
      documentType: "Other",
      uploadedAt: new Date().toISOString().slice(0, 10),
      visibleTo: DOCUMENT_VIEWERS.map((v) => v.value),
    }));
    setNewDocs((docs) => [...docs, ...next]);
  };

  const updateNewDoc = (did, field, value) =>
    setNewDocs((docs) => docs.map((d) => (d.id === did ? { ...d, [field]: value } : d)));

  const toggleNewDocViewer = (did, role) =>
    setNewDocs((docs) =>
      docs.map((d) =>
        d.id !== did
          ? d
          : {
              ...d,
              visibleTo: d.visibleTo.includes(role)
                ? d.visibleTo.filter((r) => r !== role)
                : [...d.visibleTo, role],
            }
      )
    );

  const removeNewDoc = (did) => setNewDocs((docs) => docs.filter((d) => d.id !== did));

  const removeExistingDoc = (docId) =>
    setDocuments((docs) => docs.filter((d) => d._id !== docId));

  // ---------- Save ----------
  const submit = async (e) => {
    e.preventDefault();

    if (!values.name.trim() || !values.email.trim() || !values.phone.trim()) {
      setError("Full name, email address, and phone number are required.");
      return;
    }
    if (!values.nextOfKinName.trim() || !values.nextOfKinPhone.trim()) {
      setError("Next of kin name and phone number are required.");
      return;
    }

    const languageList = languages
      .map((l) => (l.value === "Other" ? l.other.trim() : l.value))
      .filter(Boolean);
    if (!languageList.length) {
      setError("At least one language is required.");
      return;
    }

    for (const doc of newDocs) {
      if (!doc.title.trim()) {
        setError(`Please give a title to "${doc.name}".`);
        return;
      }
    }

    setError("");

    const payload = {
      fullName: values.name,
      email: values.email,
      phone: values.phone,
      keySafeCode: values.keySafeCode,
      localAuthorityNo: values.localAuthorityNo.trim() || null,
      dateOfBirth: values.dateOfBirth || undefined,
      address: values.address,
      postCode: values.postCode,
      region: values.region,
      maritalStatus: values.maritalStatus,
      religion: values.religion,
      ethnicity: values.ethnicity || undefined,
      // "|| undefined" avoids sending "" for gender, which fails the enum check on update
      gender: values.sex === "Other" ? undefined : values.sex || undefined,
      pronoun: values.pronoun || undefined,
      sexuality: values.sexuality || undefined,
      dnar: values.dnar || undefined,
      nhsNumber: values.nhsNumber.trim() || undefined,
      chiNumber: values.chiNumber.trim() || undefined,
      niNumber: values.niNumber.trim() || undefined,
      languages: languageList,
      communicationPreference: languageList[0],
      councilServiceUserId: values.councilServiceUserId.trim() || undefined,
      councilCareProviderId: values.councilCareProviderId.trim() || undefined,
      serviceType: values.serviceType.trim() || undefined,
      serviceLevel: values.serviceLevel.trim() || undefined,
      profilePhoto: values.profilePhoto || undefined,
      medicalHistory: values.medicalHistory,
      allergies: values.allergies,
      favoriteActivities: values.favouriteActivities,
      medicalHealth: {
        oxygen: values.oxygen,
        onCatheter: values.onCatheter === "Yes",
        teamInvolvement: values.teamInvolvement,
      },
      admission: {
        startDate: admission.startDate || undefined,
        banding: admission.banding || undefined,
        authorityCategory: admission.authorityCategory || undefined,
        funeralArrangements: admission.funeralArrangements || undefined,
        funeralDirector: admission.funeralDirector || undefined,
        team: admission.team || undefined,
        defaultShiftRun: admission.defaultShiftRun || undefined,
        extraFields: (admission.extraFields || [])
          .filter((f) => f.label.trim())
          .map(({ label, value }) => ({ label, value })),
      },
      dailyCare: values.dailyCare,
      emergencyContact: {
        familyMemberName: values.familyMemberName,
        relationship: values.relationship,
        nextOfKinName: values.nextOfKinName,
        nextOfKinPhone: values.nextOfKinPhone,
        emails: values.emergencyEmails.filter((x) => x.trim()),
        addresses: values.emergencyAddresses.filter((x) => x.trim()),
      },
      professionals: professionals
        .filter((p) => p.role && p.name.trim())
        .map(({ id, ...rest }) => ({ ...rest, registeredDate: rest.registeredDate || undefined })),
      foodIntake: meals
        .filter((m) => m.type)
        .map(({ type, description, time, day }) => ({
          mealType: type,
          mealDescription: description,
          mealTime: time,
          mealDay: day,
        })),
      medications: medications
        .filter((m) => m.name.trim())
        .map(({ id, ...rest }) => rest),
      documents, // existing documents that were not removed
    };

    try {
      setSubmitting(true);
      await updateClient(clientDbId, payload);

      // Upload any new documents added in this edit
      const token = localStorage.getItem("lanbeth-auth-token");
      const failed = [];
      for (const doc of newDocs) {
        try {
          const fd = new FormData();
          fd.append("file", doc.file);
          fd.append("documentType", doc.documentType);
          fd.append("title", doc.title.trim());
          fd.append("dateOfAssessment", doc.uploadedAt);
          fd.append("visibleTo", JSON.stringify(doc.visibleTo));
          const res = await fetch(`${API_BASE}/api/clients/${clientDbId}/documents`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });
          if (!res.ok) throw new Error();
        } catch {
          failed.push(doc.name);
        }
      }

      if (failed.length) {
        window.alert(`The client was saved, but these files failed to upload: ${failed.join(", ")}.`);
      }
      nav(`/admin/client-profile/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update client.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="add-client-page">
        <p>Loading client...</p>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="add-client-page">
        <div className="form-error">{error || "Client could not be loaded."}</div>
      </div>
    );
  }

  return (
    <div className="add-client-page">
      <div className="page-head">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Edit Client</h1>
          <p>Update this client's profile and care record.</p>
        </div>
      </div>

      <form className="client-form" onSubmit={submit}>
        {/* PERSONAL INFORMATION */}
        <FormSection
          icon={<User size={16} />}
          title="Personal Information"
          desc="Core identity and contact details for this client."
        >
          <div className="photo-upload">
            <div className="photo-circle">
              {values.profilePhoto ? (
                <img src={values.profilePhoto} alt={values.name || "Client"} />
              ) : (
                <span>{getInitials(values.name) || <Camera size={22} />}</span>
              )}
            </div>
            <div className="photo-actions">
              <label className="outline small photo-btn">
                <Camera size={14} />
                {values.profilePhoto ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handlePhoto(e.target.files[0])}
                />
              </label>
              {values.profilePhoto && (
                <button type="button" className="medication-remove" onClick={() => update("profilePhoto", "")}>
                  <Trash2 size={13} /> Remove
                </button>
              )}
              <small className="field-hint">JPG or PNG. It is resized automatically.</small>
            </div>
          </div>

          <div className="form-grid">
            <Field label="Full Name" required>
              <input value={values.name} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Email Address" required>
              <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Phone Number" required>
              <input value={values.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field label="Key Safe Code">
              <input value={values.keySafeCode} onChange={(e) => update("keySafeCode", e.target.value)} />
            </Field>
            <Field label="Local Authority ID No.">
              <input value={values.localAuthorityNo} onChange={(e) => update("localAuthorityNo", e.target.value)} />
            </Field>
            <Field label="Date of Birth" required>
              <input type="date" value={values.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Sex" required>
              <select value={values.sex} onChange={(e) => update("sex", e.target.value)}>
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Pronouns">
              <select value={values.pronoun} onChange={(e) => update("pronoun", e.target.value)}>
                <option value="">Select...</option>
                <option value="He">He</option>
                <option value="She">She</option>
                <option value="They">They</option>
              </select>
            </Field>
            <Field label="Sexuality">
              <select value={values.sexuality} onChange={(e) => update("sexuality", e.target.value)}>
                <option value="">Select...</option>
                {SEXUALITY_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="NHS/HSC No">
              <input value={values.nhsNumber} onChange={(e) => update("nhsNumber", e.target.value)} />
            </Field>
            <Field label="CHI Number">
              <input value={values.chiNumber} onChange={(e) => update("chiNumber", e.target.value)} />
            </Field>
            <Field label="NI No">
              <input value={values.niNumber} onChange={(e) => update("niNumber", e.target.value)} />
            </Field>
            <Field label="Address" wide required>
              <input value={values.address} onChange={(e) => update("address", e.target.value)} />
            </Field>
            <Field label="Post Code" required>
              <input value={values.postCode} onChange={(e) => update("postCode", e.target.value)} />
            </Field>
            <Field label="Region" required>
              <select value={values.region} onChange={(e) => update("region", e.target.value)}>
                <option value="">Select...</option>
                {UK_REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Marital Status">
              <select value={values.maritalStatus} onChange={(e) => update("maritalStatus", e.target.value)}>
                <option value="">Select...</option>
                <option>Single</option>
                <option>Married</option>
                <option>Widowed</option>
                <option>Divorced</option>
              </select>
            </Field>
            <Field label="Religion" required>
              <select value={values.religion} onChange={(e) => update("religion", e.target.value)}>
                <option value="">Select...</option>
                {RELIGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Ethnicity" hint="Optional">
              <select value={values.ethnicity} onChange={(e) => update("ethnicity", e.target.value)}>
                <option value="">Select... (optional)</option>
                {ETHNICITIES.map((e2) => (
                  <option key={e2}>{e2}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="form-subhead" style={{ marginTop: 24 }}>Language Preference</div>
          {languages.map((l, i) => (
            <div className="form-grid" key={l.id}>
              <Field label={i === 0 ? "Language" : `Language ${i + 1}`} required={i === 0}>
                <select value={l.value} onChange={(e) => updateLanguage(l.id, "value", e.target.value)}>
                  <option value="">Select...</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang}>{lang}</option>
                  ))}
                </select>
              </Field>
              {l.value === "Other" && (
                <Field label="Specify Language">
                  <input value={l.other} onChange={(e) => updateLanguage(l.id, "other", e.target.value)} />
                </Field>
              )}
              {languages.length > 1 && (
                <button type="button" className="medication-remove" onClick={() => removeLanguage(l.id)}>
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="outline small" onClick={addLanguage}>
            <Plus size={14} /> Add Language
          </button>
        </FormSection>

        {/* FAMILY & EMERGENCY */}
        <FormSection
          icon={<Users size={16} />}
          title="Family & Emergency Contacts"
          desc="Who to reach in the event of an emergency."
        >
          <div className="form-grid">
            <Field label="Name">
              <input value={values.familyMemberName} onChange={(e) => update("familyMemberName", e.target.value)} />
            </Field>
            <Field label="Relationship">
              <input value={values.relationship} onChange={(e) => update("relationship", e.target.value)} />
            </Field>
            <Field label="Next of Kin Name" required>
              <input value={values.nextOfKinName} onChange={(e) => update("nextOfKinName", e.target.value)} />
            </Field>
            <Field label="Next of Kin Phone" required>
              <input value={values.nextOfKinPhone} onChange={(e) => update("nextOfKinPhone", e.target.value)} />
            </Field>

            {values.emergencyAddresses.map((addr, i) => (
              <Field key={`addr-${i}`} label={i === 0 ? "Address" : `Address ${i + 1}`} wide>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={addr} onChange={(e) => updateListItem("emergencyAddresses", i, e.target.value)} />
                  {i > 0 && (
                    <button type="button" className="medication-remove" onClick={() => removeListItem("emergencyAddresses", i)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </Field>
            ))}
          </div>
          <button type="button" className="outline small" onClick={() => addListItem("emergencyAddresses")}>
            <Plus size={14} /> Add Address
          </button>

          <div className="form-grid" style={{ marginTop: 16 }}>
            {values.emergencyEmails.map((mail, i) => (
              <Field key={`mail-${i}`} label={i === 0 ? "Email" : `Email ${i + 1}`} wide>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" value={mail} onChange={(e) => updateListItem("emergencyEmails", i, e.target.value)} />
                  {i > 0 && (
                    <button type="button" className="medication-remove" onClick={() => removeListItem("emergencyEmails", i)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </Field>
            ))}
          </div>
          <button type="button" className="outline small" onClick={() => addListItem("emergencyEmails")}>
            <Plus size={14} /> Add Email
          </button>
        </FormSection>

        {/* COUNCIL */}
        <FormSection
          icon={<Landmark size={16} />}
          title="Council"
          desc="Council reference numbers and the service this client receives."
        >
          <div className="form-grid">
            <Field label="Council: Service User ID">
              <input value={values.councilServiceUserId} onChange={(e) => update("councilServiceUserId", e.target.value)} />
            </Field>
            <Field label="Council: Care Provider ID">
              <input value={values.councilCareProviderId} onChange={(e) => update("councilCareProviderId", e.target.value)} />
            </Field>
            <Field label="Service Type">
              <input value={values.serviceType} onChange={(e) => update("serviceType", e.target.value)} />
            </Field>
            <Field label="Service Level">
              <input value={values.serviceLevel} onChange={(e) => update("serviceLevel", e.target.value)} />
            </Field>
          </div>
        </FormSection>

        {/* PROFESSIONALS */}
        <FormSection
          icon={<Stethoscope size={16} />}
          title="Professionals Around the Individual"
          desc="Add each professional involved in this client's care."
        >
          {professionals.length === 0 && <p className="section-empty">No professionals added yet.</p>}

          {professionals.map((p) => (
            <div className="medication-row" key={p.id}>
              <div className="form-grid">
                <Field label="Type" required>
                  <select value={p.role} onChange={(e) => updateProfessional(p.id, "role", e.target.value)}>
                    <option value="">Select...</option>
                    {PROFESSIONAL_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Name">
                  <input value={p.name} onChange={(e) => updateProfessional(p.id, "name", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <input value={p.phone} onChange={(e) => updateProfessional(p.id, "phone", e.target.value)} />
                </Field>
                <Field label="Email">
                  <input type="email" value={p.email} onChange={(e) => updateProfessional(p.id, "email", e.target.value)} />
                </Field>
                <Field label="Post Code">
                  <input value={p.postCode} onChange={(e) => updateProfessional(p.id, "postCode", e.target.value)} />
                </Field>
                <Field label="Address" wide>
                  <input value={p.address} onChange={(e) => updateProfessional(p.id, "address", e.target.value)} />
                </Field>
                {REGISTERED_TYPES.includes(p.role) && (
                  <Field label="Registered Date">
                    <input
                      type="date"
                      value={p.registeredDate}
                      onChange={(e) => updateProfessional(p.id, "registeredDate", e.target.value)}
                    />
                  </Field>
                )}
              </div>
              <button type="button" className="medication-remove" onClick={() => removeProfessional(p.id)}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}

          <button type="button" className="outline small" onClick={addProfessional}>
            <Plus size={14} /> Add Professional
          </button>
        </FormSection>

        {/* ADMISSION */}
        <FormSection
          icon={<ClipboardList size={16} />}
          title="Admission"
          desc="Fixed admission fields are always shown. To add another, type a field name below and click Add Field."
        >
          <div className="form-grid">
            {ADMISSION_FIELDS.map(({ key, label, type }) => (
              <Field key={key} label={label}>
                <input
                  type={type || "text"}
                  value={admission[key] || ""}
                  onChange={(e) => updateAdmission(key, e.target.value)}
                />
              </Field>
            ))}

            {(admission.extraFields || []).map((f) => (
              <div key={f.id} style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <Field label={f.label}>
                    <input value={f.value} onChange={(e) => updateAdmissionField(f.id, e.target.value)} />
                  </Field>
                </div>
                <button
                  type="button"
                  className="medication-remove"
                  onClick={() => removeAdmissionField(f.id)}
                  aria-label={`Remove ${f.label}`}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Field label="New field name">
                <input
                  value={newFieldName}
                  onChange={(e) => {
                    setNewFieldName(e.target.value);
                    setFieldError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAdmissionField();
                    }
                  }}
                  placeholder="e.g. Ward Number"
                />
              </Field>
            </div>
            <button type="button" className="outline small" onClick={addAdmissionField}>
              <Plus size={14} /> Add Field
            </button>
          </div>
          {fieldError && <div className="form-error" style={{ marginTop: 8 }}>{fieldError}</div>}
        </FormSection>

        {/* MEDICAL */}
        <FormSection
          icon={<HeartPulse size={16} />}
          title="Medical Information"
          desc="A brief history, allergies, and the care the client needs."
        >
          <div className="form-grid">
            <Field label="Medical History" wide>
              <textarea
                rows={4}
                value={values.medicalHistory}
                onChange={(e) => update("medicalHistory", e.target.value)}
              />
            </Field>
            <Field label="Allergies" wide hint="Separate multiple allergies with commas">
              <input value={values.allergies} onChange={(e) => update("allergies", e.target.value)} />
            </Field>
            <Field label="DNAR / Respect">
              <select value={values.dnar} onChange={(e) => update("dnar", e.target.value)}>
                <option value="">Select...</option>
                {DNAR_OPTIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Oxygen">
              <select value={values.oxygen} onChange={(e) => update("oxygen", e.target.value)}>
                <option value="">Select...</option>
                {OXYGEN_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="On Catheter">
              <select value={values.onCatheter} onChange={(e) => update("onCatheter", e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </Field>
            <div className="field wide">
              <span>Team Involvement</span>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {TEAM_INVOLVEMENT_OPTIONS.map((t) => (
                  <label key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={values.teamInvolvement.includes(t)}
                      onChange={() => toggleTeam(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        {/* DAILY CARE & NUTRITION */}
        <FormSection
          icon={<CalendarClock size={16} />}
          title="Daily Care & Nutrition"
          desc="Routine, meal plan, and the activities this client enjoys."
        >
          <div className="form-subhead">Daily Care Schedule</div>
          <div className="form-grid">
            <Field label="Bedtime">
              <input
                type="time"
                value={values.dailyCare.bedtime}
                onChange={(e) => updateNested("dailyCare", "bedtime", e.target.value)}
              />
            </Field>
            <Field label="Bath Time">
              <input
                type="time"
                value={values.dailyCare.bathTime}
                onChange={(e) => updateNested("dailyCare", "bathTime", e.target.value)}
              />
            </Field>
          </div>

          <div className="form-subhead">Current Food Intake Plan</div>
          {meals.length === 0 && (
            <p className="section-empty">No meals added yet. Add one entry per meal (breakfast, lunch, etc).</p>
          )}
          {meals.map((meal) => (
            <div className="medication-row" key={meal.id}>
              <div className="form-grid">
                <Field label="Meal Type">
                  <select value={meal.type} onChange={(e) => updateMeal(meal.id, "type", e.target.value)}>
                    <option value="">Select...</option>
                    {MEAL_TYPES.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Meal Description">
                  <input value={meal.description} onChange={(e) => updateMeal(meal.id, "description", e.target.value)} />
                </Field>
                <Field label="Meal Time">
                  <input type="time" value={meal.time} onChange={(e) => updateMeal(meal.id, "time", e.target.value)} />
                </Field>
                <Field label="Day">
                  <select value={meal.day} onChange={(e) => updateMeal(meal.id, "day", e.target.value)}>
                    {WEEKDAYS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <button type="button" className="medication-remove" onClick={() => removeMeal(meal.id)}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <button type="button" className="outline small" onClick={addMeal}>
            <Plus size={14} /> Add Meal Entry
          </button>

          <div className="form-subhead" style={{ marginTop: 24 }}>Favourite Activities</div>
          <div className="form-grid">
            <Field label="Activities" wide>
              <textarea
                rows={4}
                value={values.favouriteActivities}
                onChange={(e) => update("favouriteActivities", e.target.value)}
                placeholder="Describe what this client enjoys doing..."
              />
            </Field>
          </div>
        </FormSection>

        {/* DOCUMENTS */}
        <FormSection
          icon={<UploadCloud size={16} />}
          title="Documents"
          desc="Existing files, plus anything new you'd like to add."
        >
          {documents.length > 0 && (
            <div className="upload-list">
              {documents.map((doc) => (
                <div className="upload-row" key={doc._id}>
                  <FileText size={15} />
                  <span className="upload-name">{doc.title || doc.fileName}</span>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">View</a>
                  )}
                  <button
                    type="button"
                    className="upload-remove"
                    onClick={() => removeExistingDoc(doc._id)}
                    aria-label={`Remove ${doc.fileName}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="upload-drop" style={{ marginTop: documents.length ? 16 : 0 }}>
            <UploadCloud size={18} />
            <span>
              <b>Click to browse</b> or drag a file in
            </span>
            <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
          </label>

          {newDocs.map((doc) => (
            <div className="upload-card" key={doc.id}>
              <div className="upload-card-top">
                <FileText size={15} />
                <span className="upload-name">{doc.name} (new)</span>
                <button
                  type="button"
                  className="upload-remove"
                  onClick={() => removeNewDoc(doc.id)}
                  aria-label={`Remove ${doc.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="form-grid">
                <Field label="Document Title" required>
                  <input value={doc.title} onChange={(e) => updateNewDoc(doc.id, "title", e.target.value)} />
                </Field>
                <Field label="Document Type">
                  <select value={doc.documentType} onChange={(e) => updateNewDoc(doc.id, "documentType", e.target.value)}>
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date">
                  <input type="date" value={doc.uploadedAt} onChange={(e) => updateNewDoc(doc.id, "uploadedAt", e.target.value)} />
                </Field>
                <div className="field wide">
                  <span>Who can view this document</span>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {DOCUMENT_VIEWERS.map((v) => (
                      <label key={v.value} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={doc.visibleTo.includes(v.value)}
                          onChange={() => toggleNewDocViewer(doc.id, v.value)}
                        />
                        {v.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </FormSection>

        {/* MEDICATION */}
        <FormSection
          icon={<Pill size={16} />}
          title="Medication Schedule"
          desc="Optional. Add, edit, or remove medications for this client."
        >
          {medications.length === 0 && <p className="section-empty">No medications added yet.</p>}

          {medications.map((med) => (
            <div className="medication-row" key={med.id}>
              <div className="form-grid">
                <Field label="Medication Name">
                  <input value={med.name} onChange={(e) => updateMedication(med.id, "name", e.target.value)} />
                </Field>
                <Field label="Dosage">
                  <input value={med.dosage} onChange={(e) => updateMedication(med.id, "dosage", e.target.value)} />
                </Field>
                <Field label="Time">
                  <input type="time" value={med.time} onChange={(e) => updateMedication(med.id, "time", e.target.value)} />
                </Field>
                <Field label="Date">
                  <input type="date" value={med.date} onChange={(e) => updateMedication(med.id, "date", e.target.value)} />
                </Field>
                <Field label="Instructions" wide>
                  <input value={med.instructions} onChange={(e) => updateMedication(med.id, "instructions", e.target.value)} />
                </Field>
              </div>
              <button type="button" className="medication-remove" onClick={() => removeMedication(med.id)}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}

          <button type="button" className="outline small" onClick={addMedication}>
            <Plus size={14} /> Add Another Medication
          </button>
        </FormSection>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="outline" onClick={() => nav(-1)} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            <Pencil size={15} />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ icon, title, desc, children }) {
  return (
    <section className="form-section">
      <div className="form-section-head">
        <span className="form-section-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          {desc && <p>{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, wide, hint, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </label>
  );
}

export default EditClient;