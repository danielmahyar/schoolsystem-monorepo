import { useAxiosPrivate } from "api";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  AssignmentStatus,
  FunctionalityAPIEndpoints,
  GET_ASSIGNMENTS_FROM_STUDENT,
  Student,
} from "types";

export type StudentUI = {
  STUDENT_ID: number;
  ADDRESS: string;
  PHONE_NUMBER: number;
  EMAIL: string;
  FIRSTNAME: string;
  LASTNAME: string;
  PHOTO_URL: string;
  DOB: Date;
};

export type AdminAssignmentView = {
  STATUS: string;
  STUDENT_TASK_ID: number;
  ASSIGNMENT_ID: number;
  TEACHER_ID: number;
  ASSIGNMENT_NAME: string;
  GRADE_TYPE: string;
  SUBJECT: string;
  CLASS_ID: number;
  DEADLINE: Date;
};

const StudentViewPage = () => {
  const params = useParams<"id">();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentUI | null>(null);
  const [assignments, setAssignments] = useState<AdminAssignmentView[] | null>(
    []
  );
  const axios = useAxiosPrivate();

  useEffect(() => {
    axios
      .get(FunctionalityAPIEndpoints.GET_STUDENT_INFO + params.id)
      .then((res) =>
        setStudent({ ...res.data, DOB: new Date(res.data.DOB) || res.data.DOB })
      )
      .catch((err) => console.log(err));
  }, [params]);

  const handleGetAssignments = async () => {
    try {
      const url: GET_ASSIGNMENTS_FROM_STUDENT = `http://localhost:3002/v1/api/teachers/info/students/${params.id}/assignments`;
      const { data }: { data: AdminAssignmentView[] } = await axios.get(url);
      setAssignments(
        data.map((a) => ({
          ...a,
          DEADLINE: new Date(a.DEADLINE) || a.DEADLINE,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeeSpecificAssignment = (assignment: AdminAssignmentView) => {
    navigate(`/student/${params.id}/assignment/${assignment.ASSIGNMENT_ID}`);
  };

  if (!student) return <div>Loading...</div>;

  return (
    <section className="flex w-full h-full overflow-auto">
      <article className="w-full">
        <button onClick={() => navigate(-1)}>Go back</button>
        <img src={student.PHOTO_URL} className="w-96 h-96 rounded-2xl" />
        <h1>
          {student.FIRSTNAME} {student.LASTNAME}
        </h1>
        <p>{student.ADDRESS}</p>
        <p>{student.PHONE_NUMBER}</p>
        <p>{student.EMAIL}</p>
        <p>{student.DOB.toUTCString()}</p>
      </article>
      <ul className="w-full space-y-2 h-full overflow-auto flex flex-col p-2">
        <button onClick={handleGetAssignments} className="bg-primary px-4 py-2">
          View assignments
        </button>
        {assignments &&
          assignments.map((assignment, index) => (
            <li
              className="w-full h-auto bg-primary p-4 flex items-center justify-between rounded-lg"
              key={index}
            >
              <div>
                <h1>{assignment.ASSIGNMENT_NAME}</h1>
                <p>{assignment.SUBJECT}</p>
                <p>{assignment.DEADLINE.toLocaleString()}</p>
                <p>STUDENT_TASK_ID: {assignment.STUDENT_TASK_ID}</p>

                {assignment.STATUS === AssignmentStatus.NOT_DONE && (
                  <MdError className="text-danger" size={40}>
                    Not started
                  </MdError>
                )}
                {assignment.STATUS === AssignmentStatus.SUBMITTED && (
                  <MdCheckCircle className="text-success" size={40}>
                    Submitted
                  </MdCheckCircle>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleSeeSpecificAssignment(assignment)}
                  className="bg-warning py-1 px-4"
                >
                  See assignment
                </button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default StudentViewPage;
