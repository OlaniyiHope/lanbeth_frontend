import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  Cake,
  MapPin,
  UserRound,
  FileHeart,
  Pill,
  Heart,
  CalendarClock,
  ShieldAlert,
  FolderOpen,
  Users,
  ClipboardList,
  Utensils,
  Clock,
  FileText,
  Download,
  ShieldCheck,
  UserPlus,
  Send,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";

import "./ClientProfile.css";


const TABS = [

  {
    key: "personal",
    label: "Personal Info",
    icon: UserRound,
  },

  {
    key: "medical",
    label: "Medical History",
    icon: FileHeart,
  },

  {
    key: "foodIntake",
    label: "Food Intake",
    icon: Utensils,
  },

  {
    key: "medications",
    label: "Medications",
    icon: Pill,
  },

  {
    key: "activities",
    label: "Favorite Activities",
    icon: Heart,
  },

  {
    key: "daily",
    label: "Daily Care",
    icon: CalendarClock,
  },

  {
    key: "allergies",
    label: "Allergies",
    icon: ShieldAlert,
  },

  {
    key: "documents",
    label: "Documents",
    icon: FolderOpen,
  },

  {
    key: "family",
    label: "Family & Emergency",
    icon: Users,
  },

  {
    key: "reports",
    label: "View Reports",
    icon: ClipboardList,
  },

];



function formatTime(value) {

  if (!value) return null;

  const [h, m] = value.split(":");

  const hour = Number(h);

  if (Number.isNaN(hour)) return value;

  const period = hour >= 12 ? "PM" : "AM";

  const twelveHour =
    hour % 12 === 0 ? 12 : hour % 12;

  return `${String(twelveHour).padStart(2, "0")}:${m} ${period}`;

}



function getInitials(name = "") {

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

}



function getAge(dob) {

  if (!dob) return null;

  const birth = new Date(dob);

  if (Number.isNaN(birth.getTime())) return null;

  const diff =
    Date.now() - birth.getTime();

  return Math.floor(
    diff /
      (365.25 *
        24 *
        60 *
        60 *
        1000)
  );

}



export default function ClientProfile() {

  const navigate = useNavigate();

  const { id } = useParams();

  const { data } = useData();

  const [activeTab, setActiveTab] =
    useState("personal");



  /*
   * Find the client assigned to this staff member.
   */

  const client =
    data?.clients?.find(
      (item) => item.id === id
    ) || null;



  if (!client) {

    return (

      <div className="staff-client-profile-page">

        <div className="empty-client-profile">

          <div className="empty-client-icon">
            <Users size={25} />
          </div>

          <h2>
            Client Not Found
          </h2>

          <p>
            The client you are trying to view
            could not be found.
          </p>

          <button
            className="primary"
            onClick={() =>
              navigate("/staff/clients")
            }
          >
            <ArrowLeft size={15} />
            Back to Assigned Clients
          </button>

        </div>

      </div>

    );

  }



  const age =
    getAge(client.dateOfBirth);



  return (

    <div className="staff-client-profile-page">



      {/* PAGE HEADER */}

      <div className="page-head">

        <div className="page-head-left">

          <button
            className="icon-btn"
            onClick={() =>
              navigate("/staff/clients")
            }
            aria-label="Back to clients"
          >

            <ArrowLeft size={18} />

          </button>


          <div>

            <div className="eyebrow">
              LANBETHCARE STAFF
            </div>

            <h1>
              Client Profile
            </h1>

            <p>
              View client care information
              and submit care reports.
            </p>

          </div>

        </div>



        {/* STAFF ACTION */}

        <button
          className="primary report-button"
          onClick={() =>
            navigate(
              `/staff/submit-report/${client.id}`
            )
          }
        >

          <Send size={15} />

          Submit Report

        </button>

      </div>





      {/* CLIENT HERO */}

      <div className="client-hero">

        <div className="client-hero-main">


          <span className="client-hero-avatar">

            {
              client.initials ||
              getInitials(client.name)
            }

          </span>



          <div className="client-hero-id">

            <h2>
              {client.name}
            </h2>


            <span className="client-hero-code">

              Client ID: {client.id}

            </span>



            <div className="client-hero-meta">


              {
                age !== null && (

                  <span>
                    {age} years old
                  </span>

                )
              }



              {
                client.sex && (

                  <span>
                    {client.sex}
                  </span>

                )
              }



              {
                client.phone && (

                  <span>

                    <Phone size={12} />

                    {client.phone}

                  </span>

                )
              }



              {
                client.email && (

                  <span>

                    <Mail size={12} />

                    {client.email}

                  </span>

                )
              }


            </div>

          </div>

        </div>



        <div className="client-status-area">

          <span className="client-status">

            <i />

            {client.status || "Active"}

          </span>

          <small>
            Assigned Client
          </small>

        </div>

      </div>





      {/* READ ONLY NOTICE */}

      <div className="readonly-notice">

        <ShieldCheck size={17} />

        <div>

          <strong>
            Read-only client information
          </strong>

          <p>
            You can view the client's care
            information and submit reports,
            but client details can only be
            changed by an administrator.
          </p>

        </div>

      </div>





      {/* TABS */}

      <div
        className="client-tabs"
        role="tablist"
      >

        {
          TABS.map((tab) => {

            const Icon = tab.icon;

            const active =
              activeTab === tab.key;

            return (

              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                className={
                  `client-tab ${
                    active ? "active" : ""
                  }`
                }
                onClick={() =>
                  setActiveTab(tab.key)
                }
              >

                <Icon size={14} />

                {tab.label}

              </button>

            );

          })
        }

      </div>





      {/* TAB CONTENT */}

      <div className="client-tab-panel">


        {
          activeTab === "personal" && (
            <PersonalInfoTab
              client={client}
            />
          )
        }


        {
          activeTab === "medical" && (
            <MedicalHistoryTab
              client={client}
            />
          )
        }


        {
          activeTab === "foodIntake" && (
            <FoodIntakeTab
              client={client}
            />
          )
        }


        {
          activeTab === "medications" && (
            <MedicationsTab
              client={client}
            />
          )
        }


        {
          activeTab === "activities" && (
            <ActivitiesTab
              client={client}
            />
          )
        }


        {
          activeTab === "daily" && (
            <DailyCareTab
              client={client}
            />
          )
        }


        {
          activeTab === "allergies" && (
            <AllergiesTab
              client={client}
            />
          )
        }


        {
          activeTab === "documents" && (
            <DocumentsTab
              client={client}
            />
          )
        }


        {
          activeTab === "family" && (
            <FamilyTab
              client={client}
            />
          )
        }


        {
          activeTab === "reports" && (
            <ReportsTab
              client={client}
              onSubmitReport={() =>
                navigate(
                  `/staff/submit-report/${client.id}`
                )
              }
            />
          )
        }


      </div>





      <div className="watermark">

        LAMBETH RESOLUTION HOMECARE

      </div>


    </div>

  );

}







/* =====================================================
   PERSONAL INFORMATION
===================================================== */

function PersonalInfoTab({ client }) {

  return (

    <div className="info-panel">


      <div className="info-panel-section">

        <h3>
          Contact Details
        </h3>


        <div className="info-grid">


          <Info
            icon={<Mail size={13} />}
            label="Email"
            value={client.email}
          />


          <Info
            icon={<Phone size={13} />}
            label="Phone"
            value={client.phone}
          />


          <Info
            icon={<Cake size={13} />}
            label="Date of Birth"
            value={client.dateOfBirth}
          />


          <Info
            icon={<MapPin size={13} />}
            label="Address"
            value={client.address}
          />


          <Info
            label="Post Code"
            value={client.postCode}
          />


          <Info
            label="Region"
            value={client.region}
          />

        </div>

      </div>




      <div className="info-panel-section">

        <h3>
          Background
        </h3>


        <div className="info-grid">


          <Info
            label="Sex"
            value={client.sex}
          />


          <Info
            label="Marital Status"
            value={client.maritalStatus}
          />


          <Info
            label="Religion"
            value={client.religion}
          />


          <Info
            label="Ethnicity"
            value={client.ethnicity}
          />


          <Info
            label="Key Safe Code"
            value={client.keySafeCode}
          />


          <Info
            label="Communication Preference"
            value={
              client.communicationPreference
            }
            wide
          />

        </div>

      </div>


    </div>

  );

}







/* =====================================================
   MEDICAL
===================================================== */

function MedicalHistoryTab({ client }) {

  const history =
    client.medicalHistory?.trim();


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Medical History
        </h3>


        {
          history ? (

            <p className="note-block">
              {history}
            </p>

          ) : (

            <EmptyState
              icon={<FileHeart size={20} />}
              title="No medical history recorded"
              desc="Medical conditions, previous procedures, and care notes will appear here."
            />

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   FOOD
===================================================== */

function FoodIntakeTab({ client }) {

  const meal =
    client.meal || {};


  const hasMeal =
    meal.type ||
    meal.description ||
    meal.time;


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Current Food Intake Plan
        </h3>


        {
          hasMeal ? (

            <div className="info-grid">

              <Info
                label="Meal Type"
                value={meal.type}
              />

              <Info
                label="Meal Time"
                value={formatTime(meal.time)}
              />

              <Info
                label="Meal Day"
                value={meal.day}
              />

              <Info
                label="Meal Description"
                value={meal.description}
                wide
              />

            </div>

          ) : (

            <EmptyState
              icon={<Utensils size={20} />}
              title="No food intake plan recorded"
              desc="Meal type, timing, and dietary notes will appear here."
            />

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   MEDICATIONS
===================================================== */

function MedicationsTab({ client }) {

  const medications =
    client.medications || [];


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Medication Schedule
        </h3>


        {
          medications.length === 0 ? (

            <EmptyState
              icon={<Pill size={20} />}
              title="No medications recorded"
              desc="Medications assigned to this client will appear here."
            />

          ) : (

            <div className="medication-list">

              {
                medications.map(
                  (med, index) => (

                    <div
                      className="medication-card"
                      key={med.id || index}
                    >

                      <span className="medication-icon">

                        <Pill size={15} />

                      </span>


                      <div className="medication-details">

                        <div className="medication-top">

                          <b>
                            {
                              med.name ||
                              "Untitled medication"
                            }
                          </b>


                          {
                            med.dosage && (

                              <span className="medication-badge">
                                {med.dosage}
                              </span>

                            )
                          }

                        </div>


                        <div className="medication-meta">

                          {
                            med.time && (

                              <span>

                                <Clock size={12} />

                                {formatTime(
                                  med.time
                                )}

                              </span>

                            )
                          }


                          {
                            med.date && (

                              <span>
                                {med.date}
                              </span>

                            )
                          }

                        </div>


                        {
                          med.instructions && (

                            <p className="medication-instructions">

                              {med.instructions}

                            </p>

                          )
                        }

                      </div>

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   ACTIVITIES
===================================================== */

function ActivitiesTab({ client }) {

  const activities =
    client.favouriteActivities?.trim();


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Favourite Activities
        </h3>


        {
          activities ? (

            <p className="note-block">
              {activities}
            </p>

          ) : (

            <EmptyState
              icon={<Heart size={20} />}
              title="No favourite activities recorded"
              desc="Hobbies and preferences that support the client's wellbeing will appear here."
            />

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   DAILY CARE
===================================================== */

function DailyCareTab({ client }) {

  const dailyCare =
    client.dailyCare || {};


  const hasSchedule =
    dailyCare.bedtime ||
    dailyCare.bathTime;


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Daily Care Schedule
        </h3>


        {
          hasSchedule ? (

            <div className="info-grid">

              <Info
                icon={<Clock size={13} />}
                label="Bedtime"
                value={
                  formatTime(
                    dailyCare.bedtime
                  )
                }
              />


              <Info
                icon={<Clock size={13} />}
                label="Bath Time"
                value={
                  formatTime(
                    dailyCare.bathTime
                  )
                }
              />

            </div>

          ) : (

            <EmptyState
              icon={<CalendarClock size={20} />}
              title="No daily care schedule recorded"
              desc="The client's daily care routine will appear here."
            />

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   ALLERGIES
===================================================== */

function AllergiesTab({ client }) {

  const list =
    (client.allergies || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Allergies
        </h3>


        {
          list.length === 0 ? (

            <EmptyState
              icon={<ShieldAlert size={20} />}
              title="No allergies recorded"
              desc="Known allergies and sensitivities will appear here."
            />

          ) : (

            <div className="allergy-chips">

              {
                list.map((allergy) => (

                  <span
                    className="allergy-chip"
                    key={allergy}
                  >

                    <ShieldAlert size={12} />

                    {allergy}

                  </span>

                ))
              }

            </div>

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   DOCUMENTS
===================================================== */

function DocumentsTab({ client }) {

  const documents =
    client.documents || [];


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Client Documents
        </h3>


        {
          documents.length === 0 ? (

            <EmptyState
              icon={<FolderOpen size={20} />}
              title="No documents uploaded"
              desc="Care plans, identity documents, and other client files will appear here."
            />

          ) : (

            <div className="doc-list">

              {
                documents.map(
                  (doc, index) => (

                    <div
                      className="doc-row"
                      key={
                        doc.id ||
                        index
                      }
                    >

                      <span className="doc-icon">

                        <FileText size={15} />

                      </span>


                      <div className="doc-details">

                        <b>
                          {doc.name}
                        </b>

                        {
                          doc.type && (

                            <small>
                              {doc.type}
                            </small>

                          )
                        }

                      </div>


                      {
                        doc.url && (

                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>

                        )
                      }

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   FAMILY
===================================================== */

function FamilyTab({ client }) {

  const hasContact =
    client.familyMemberName ||
    client.nextOfKinName ||
    client.nextOfKinPhone;


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <h3>
          Family & Emergency Contact
        </h3>


        {
          hasContact ? (

            <div className="info-grid">

              <Info
                icon={<Users size={13} />}
                label="Family Member Name"
                value={
                  client.familyMemberName
                }
              />


              <Info
                label="Relationship"
                value={
                  client.relationship
                }
              />


              <Info
                icon={<UserPlus size={13} />}
                label="Next of Kin Name"
                value={
                  client.nextOfKinName
                }
              />


              <Info
                icon={<Phone size={13} />}
                label="Next of Kin Phone"
                value={
                  client.nextOfKinPhone
                }
              />

            </div>

          ) : (

            <EmptyState
              icon={<Users size={20} />}
              title="No emergency contact recorded"
              desc="Family and next-of-kin details will appear here."
            />

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   REPORTS
===================================================== */

function ReportsTab({
  client,
  onSubmitReport
}) {

  const reports =
    client.reports || [];


  return (

    <div className="info-panel">

      <div className="info-panel-section">

        <div className="reports-heading">

          <div>

            <h3>
              Care Reports
            </h3>

            <p>
              Reports submitted for this client.
            </p>

          </div>


          <button
            className="primary"
            onClick={onSubmitReport}
          >

            <Send size={14} />

            Submit New Report

          </button>

        </div>



        {
          reports.length === 0 ? (

            <EmptyState
              icon={<ClipboardList size={20} />}
              title="No reports submitted yet"
              desc="Your submitted daily care reports will appear here."
            />

          ) : (

            <div className="reports-list">

              {
                reports.map(
                  (report, index) => (

                    <div
                      className="report-card"
                      key={
                        report.id ||
                        index
                      }
                    >

                      <div className="report-card-header">

                        <div>

                          <b>
                            Care Report
                          </b>

                          <small>
                            {report.date ||
                              "No date"}
                          </small>

                        </div>


                        <span className="report-status">

                          Submitted

                        </span>

                      </div>



                      <div className="report-grid">


                        <Info
                          label="Staff"
                          value={
                            report.staff
                          }
                        />


                        <Info
                          label="Medication Given"
                          value={
                            report.medicationGiven
                          }
                        />


                        <Info
                          label="Meal Given"
                          value={
                            report.mealGiven
                          }
                        />


                        <Info
                          icon={
                            <Clock size={13} />
                          }
                          label="Bath Time"
                          value={
                            formatTime(
                              report.bathTime
                            )
                          }
                        />


                        <Info
                          icon={
                            <Clock size={13} />
                          }
                          label="Bedtime"
                          value={
                            formatTime(
                              report.bedtime
                            )
                          }
                        />


                        <Info
                          label="Incident"
                          value={
                            report.incident
                          }
                          wide
                        />


                        <Info
                          label="Comments"
                          value={
                            report.comments
                          }
                          wide
                        />


                      </div>



                      <div className="report-links">


                        {
                          report.uploadUrl && (

                            <a
                              href={
                                report.uploadUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >

                              <FileText size={13} />

                              View Report

                            </a>

                          )
                        }


                        {
                          report.downloadUrl && (

                            <a
                              href={
                                report.downloadUrl
                              }
                              download
                            >

                              <Download size={13} />

                              Download

                            </a>

                          )
                        }


                      </div>


                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

}







/* =====================================================
   INFO
===================================================== */

function Info({
  icon,
  label,
  value,
  wide
}) {

  let displayValue = "—";


  if (
    typeof value === "string"
  ) {

    displayValue =
      value.trim() || "—";

  } else if (value) {

    displayValue = value;

  }


  return (

    <div
      className={
        `info-item ${
          wide ? "wide" : ""
        }`
      }
    >

      <small>

        {icon}

        {label}

      </small>


      <b>
        {displayValue}
      </b>

    </div>

  );

}







/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  icon,
  title,
  desc
}) {

  return (

    <div className="coming-soon">

      <span className="coming-soon-icon">

        {icon}

      </span>


      <h3>
        {title}
      </h3>


      <p>
        {desc}
      </p>

    </div>

  );

}