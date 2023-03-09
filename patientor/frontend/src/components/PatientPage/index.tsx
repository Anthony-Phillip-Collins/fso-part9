import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientServices from "../../services/patientServices";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { Patient } from "../../types/Patient";
import { Diagnose } from "../../types/Diagnose";

interface GenderIconProps {
  gender: "male" | "female" | "other";
}

const GenderIcon = ({ gender }: GenderIconProps) => {
  switch (gender) {
    case "female":
      return <FemaleIcon />;
    case "male":
      return <MaleIcon />;
    default:
      return null;
  }
};

interface Props {
  diagnoses: Diagnose[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams();

  const getDescriptionOf = (code: string): string | undefined =>
    diagnoses.find((d) => d.code === code)?.name;

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const p = await patientServices.getById(id);
          if (p) {
            setPatient(p);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    loadData();
  }, [id]);

  return (
    <>
      <h3>
        {patient?.name}{" "}
        {patient?.gender && <GenderIcon gender={patient.gender} />}
      </h3>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>

      <h4>entries</h4>
      {patient?.entries.map((entry) => (
        <div key={entry.id}>
          <p>
            {entry.date} <em>{entry.description}</em>
          </p>
          <ul>
            {entry?.diagnosisCodes?.map((code, i) => (
              <li key={i}>
                {code} {getDescriptionOf(code)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default PatientPage;
