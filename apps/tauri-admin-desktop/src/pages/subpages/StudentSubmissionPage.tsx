import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AssignmentStatus,
  MulterFile,
  SEE_ASSIGNMENT_FROM_STUDENT,
} from "types";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { downloadedFilesState } from "../../global-state/file-downloads";
import { downloadFileToClient } from "../../helper-functions/fs";
import {
  MdAdd,
  MdCheckCircle,
  MdDelete,
  MdEdit,
  MdError,
  MdFileDownload,
  MdSend,
} from "react-icons/md";
import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { useAxiosPrivate } from "api";

// Generated by https://quicktype.io

export interface Assignment {
  STUDENT_TASK_ID: number;
  ASSIGNMENT_ID: number;
  STUDENT_ID: number;
  STUDENT_WORK: null;
  GRADE: null;
  STATUS: string;
  TEACHER_ID: number;
  ASSIGNMENT_NAME: string;
  ASSIGNMENT_DESCRIPTION: string;
  GRADE_TYPE: string;
  SUBJECT: string;
  CLASS_ID: number;
  DEADLINE: string;
  TEACHER_PUBLIC_NAME: string;
  WORK_FILES: WorkFile[];
  ASSIGNMENT_FILES: AssignmentFile[];
}

export interface AssignmentFile {
  FILE_ID: number;
  ASSIGNMENT_ID: number;
  TEACHER_ID: number;
  FILE_NAME: string;
  FILE_URL: string;
  UPLOADED_AT: string;
}

export interface WorkFile {
  STUDENT_FILE_ID: number;
  STUDENT_ID: number;
  ASSIGNMENT_ID: number;
  FILE_NAME: string;
  FILE_URL: string;
  UPLOADED_AT: string;
}

enum UploadStatus {
  NOT_UPLOADED = "NOT_UPLOADED",
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
}

const StudentSubmissionPage = () => {
  const params = useParams<{ id: string; assignmentID: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [files, setFiles] = useRecoilState(downloadedFilesState);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const axios = useAxiosPrivate();
  const isSubmitted = assignment?.STATUS === AssignmentStatus.SUBMITTED;

  useEffect(() => {
    const url: SEE_ASSIGNMENT_FROM_STUDENT = `http://localhost:3002/v1/api/admin/students/${params.id}/assignments/${params.assignmentID}`;
    axios
      .get(url)
      .then((res) => setAssignment(res.data))
      .catch((err) => console.log(err));
  }, [params]);

  const handleDownloadFile = async (file: WorkFile | AssignmentFile) => {
    try {
      const parsedFile = await downloadFileToClient(axios, file);
      setFiles([...files, parsedFile]);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation();
  };

  const handleDeleteFile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `http://localhost:3002/v1/api/admin/students/${params.id}/assignments/${params.assignmentID}/${assignment?.WORK_FILES[index].FILE_NAME}`
      );
      setAssignment(
        assignment && {
          ...assignment,
          WORK_FILES: [...assignment.WORK_FILES.filter((_, i) => i !== index)],
        }
      );
      toast.success("File deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        title: "Select files",
        filters: [
          {
            name: "Assignment Work File",
            extensions: [
              "png",
              "jpeg",
              "jpg",
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "txt",
            ],
          },
        ],
      });
      if (!selected) return toast.error("No files selected");

      const loading = toast.loading(
        `Uploading ${selected.length > 1 ? "files" : "file"}...`
      );

      const filesToUpload = Array.isArray(selected) ? selected : [selected];
      const fileNamesToUpload = filesToUpload.map((path) => {
        const paths = path.split("\\");
        return {
          FILE_NAME: paths[paths.length - 1],
          DISK_PATH: path,
          STATUS: UploadStatus.NOT_UPLOADED,
        };
      });

      setUploadedFiles([...uploadedFiles, ...fileNamesToUpload]);

      let formData = new FormData();

      for (const path of fileNamesToUpload) {
        const file = await readBinaryFile(path.DISK_PATH);
        formData.append("files", new Blob([file]), path.FILE_NAME);
      }

      const { data }: { data: { files: MulterFile[] } } = await axios.post(
        `http://localhost:3002/v1/api/admin/students/${params.id}/assignments/${params.assignmentID}/upload-files`,
        formData
      );

      setUploadedFiles([]);
      if (assignment === null || params.id === undefined) return;
      setAssignment({
        ...assignment,
        WORK_FILES: [
          ...assignment.WORK_FILES,
          ...data.files.map((f) => ({
            ASSIGNMENT_ID: 10,
            FILE_NAME: f.originalname,
            FILE_URL: f.path,
            STUDENT_FILE_ID: f.size,
            STUDENT_ID: 2,
            UPLOADED_AT: "",
          })),
        ],
      });
      toast.dismiss(loading);
      toast.success("Files uploaded successfully");
    } catch (error) {
      setUploadedFiles([]);
      toast.error("Error uploading files");
      console.log(error);
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      await axios.patch(
        `http://localhost:3002/v1/api/admin/students/${params.id}/assignments/${params.assignmentID}/submit`
      );
      setAssignment(
        assignment && { ...assignment, STATUS: AssignmentStatus.SUBMITTED }
      );
      toast.success("Assignment submitted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReleaseAssignment = async () => {
    try {
      await axios.patch(
        `http://localhost:3002/v1/api/teachers/classes/${params.id}/assignments/${params.assignmentID}/student/${params.id}`
      );
      setAssignment(
        assignment && { ...assignment, STATUS: AssignmentStatus.NOT_DONE }
      );
      toast.success("Assignment released successfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="h-full w-full z-0">
      {assignment && (
        <article className="w-full h-full p-12 flex flex-col">
          <section className="w-full h-full flex mb-5">
            <article className="w-full h-full flex flex-col space-y-2">
              <h1 className="font-bold text-2xl py-4">
                {assignment.ASSIGNMENT_NAME}
              </h1>

              <p className="border border-input-border p-4 w-full h-full overflow-auto">
                {assignment.ASSIGNMENT_DESCRIPTION}
              </p>

              <div className="h-24 flex flex-col overflow-y-auto">
                {assignment.ASSIGNMENT_FILES.map((file, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between bg-primary text-white font-bold py-2 px-4"
                    onClick={() => handleDownloadFile(file)}
                  >
                    {file.FILE_NAME}
                    <MdFileDownload />
                  </button>
                ))}
              </div>
            </article>
            <article className="w-full flex items-center justify-center flex-col ">
              <div className="w-full h-2/5 p-4">
                {!isSubmitted && (
                  <div className="flex flex-col items-center justify-center">
                    <MdError className="text-danger" size={140} />
                    <p className="text-xl font-bold">
                      The student has not submitted the assignment yet
                    </p>
                  </div>
                )}
                {isSubmitted && (
                  <div className="flex flex-col items-center justify-center">
                    <MdCheckCircle className="text-success" size={140} />
                    <p className="text-xl font-bold">
                      The student submitted the assignment{" "}
                    </p>
                  </div>
                )}
              </div>
              <div className="h-full w-full flex flex-col items-start justify-end p-4">
                <h1>
                  <strong>Assignment Author:</strong>{" "}
                  {assignment.TEACHER_PUBLIC_NAME}
                </h1>
                <h2>
                  <strong>Deadline: </strong>
                  {new Date(assignment.DEADLINE).toUTCString()}
                </h2>
              </div>
            </article>
          </section>
          <section className="w-full h-1/3 flex select-none">
            <article className="flex h-full w-full flex-col space-y-2">
              <ul className="flex flex-col border-primary border h-24 overflow-y-auto ">
                {assignment.WORK_FILES.map((file, index) => (
                  <div
                    onClick={() => handleDownloadFile(file)}
                    className="p-2 flex items-center justify-between cursor-pointer transition-all ease-in-out group hover:bg-primary hover:text-white"
                    tabIndex={index + 1}
                    key={index}
                  >
                    <div className="flex items-center justify-start space-x-2">
                      <MdFileDownload
                        className="group-hover:animate-bounce"
                        size={20}
                      />
                      <p>{file.FILE_NAME}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!isSubmitted && (
                        <>
                          <button
                            className=" hover:text-warning"
                            onClick={(e) => handleEditFile(e, index)}
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            className=" hover:text-warning"
                            onClick={(e) => handleDeleteFile(e, index)}
                          >
                            <MdDelete size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {uploadedFiles.length > 0 &&
                  uploadedFiles.map((uploadedFile, index) => (
                    <div
                      onClick={() => console.log("Test")}
                      className="p-2 flex items-center justify-between cursor-pointer transition-all ease-in-out group hover:bg-primary hover:text-white"
                      tabIndex={index++}
                      key={index}
                    >
                      <div className="flex items-center justify-start space-x-2">
                        <MdFileDownload
                          className="group-hover:animate-bounce"
                          size={20}
                        />
                        <p>{uploadedFile.FILE_NAME}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className=" hover:text-warning"
                          onClick={(e) => handleEditFile(e, index)}
                        >
                          <MdEdit size={20} />
                        </button>
                        {/* <button className=" hover:text-warning" onClick={(e) => handleDeleteFile(e, index)}><MdDelete size={20} /></button> */}
                      </div>
                    </div>
                  ))}
              </ul>
              {!isSubmitted && (
                <button
                  onClick={handleAddFiles}
                  className="w-full bg-primary py-2 text-white group rounded-sm flex items-center justify-center transition-all ease-in-out hover:bg-opacity-80"
                >
                  <MdAdd size={25} className="group-hover:animate-bounce" />
                </button>
              )}
            </article>
            <article className="w-full flex items-start justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAssignment}
                  className="flex py-2 px-4 items-center space-x-2 bg-primary rounded-lg text-white font-bold"
                >
                  <MdSend />
                  <p>Submit assignment</p>
                </button>
              ) : (
                <button
                  onClick={handleReleaseAssignment}
                  className="flex py-2 px-4 items-center space-x-2 bg-primary rounded-lg text-white font-bold"
                >
                  <MdSend />
                  <p>Release assignment</p>
                </button>
              )}
            </article>
          </section>
        </article>
      )}
    </section>
  );
};

export default StudentSubmissionPage;
