import { forage } from "@tauri-apps/tauri-forage";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { AuthenticationAPIEndpoints, FunctionalityAPIEndpoints } from "types";
import { axiosPost } from "../../helper-functions/axios";

const CreateStudentPage = () => {
  const [img, setImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    email: "",
    dob: "",
  });

  const handleImgUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const img = files[0];
    const url = URL.createObjectURL(img);
    setImg(url);
    setFile(img);
  };

  const uploadImageToServer = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      FunctionalityAPIEndpoints.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res.data;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ff = new FormData();
    ff.append("image", file as Blob);

    try {
      let imageData: { url: string } | null = null;
      if (file) {
        imageData = await uploadImageToServer();
      }

      const data = await axiosPost(
        AuthenticationAPIEndpoints.AUTHENTICATION_CREATE_STUDENT,
        {
          ...formData,
          username: `${formData.firstName}_${formData.lastName}`,
          photoUrl: imageData?.url || null,
          password: "test",
        }
      );

      console.log(data);

      toast.success("Student created successfully");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <section className="h-full w-full overflow-y-auto overflow-x-hidden p-8  space-y-3">
      <h1 className="text-2xl font-bold pb-8">Create a new student</h1>
      {/* Make input fields for address phone number email firstname and lastname */}
      <form onSubmit={handleSubmit}>
        <article className="bg-dark p-8 rounded-lg">
          <h1>Enter Personal Details</h1>
          <div className="bg-dark grid grid-cols-2 xl:grid-cols-4 ">
            <input
              type="text"
              name="firstname"
              onInput={(e) =>
                setFormData({ ...formData, firstName: e.currentTarget.value })
              }
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
              placeholder="First name"
            />
            <input
              type="text"
              onInput={(e) =>
                setFormData({ ...formData, lastName: e.currentTarget.value })
              }
              name="lastname"
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
              placeholder="Last name"
            />
            <input
              type="email"
              name="email"
              onInput={(e) =>
                setFormData({ ...formData, email: e.currentTarget.value })
              }
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              onInput={(e) =>
                setFormData({ ...formData, phone: e.currentTarget.value })
              }
              placeholder={"52 22 22 22"}
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
              // pattern={"[0-9][0-9] [0-9][0-9] [0-9][0-9] [0-9][0-9] [0-9][0-9]"}
            />
          </div>
        </article>
        <article className="bg-dark p-8 rounded-lg">
          <h1>Enter address here</h1>
          <div className="bg-dark grid grid-cols-2 xl:grid-cols-4 ">
            <input
              type="text"
              onInput={(e) =>
                setFormData({ ...formData, address: e.currentTarget.value })
              }
              placeholder="Solvænget 4"
              name=""
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
            />
            <input
              type="zip"
              name=""
              onInput={(e) =>
                setFormData({ ...formData, zip: e.currentTarget.value })
              }
              placeholder="1234"
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
            />
            <input
              type="text"
              onInput={(e) =>
                setFormData({ ...formData, city: e.currentTarget.value })
              }
              placeholder="København"
              name=""
              className="w-full px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
            />
          </div>
        </article>
        <article className="bg-dark p-8 rounded-lg">
          <input
            onChange={handleImgUpload}
            type="file"
            placeholder="Profile picture"
          />
          {img && <img src={img} alt="profile" className="w-20 " />}
        </article>
        <button className="py-2 px-4 bg-primary">Submit</button>
      </form>
    </section>
  );
};

export default CreateStudentPage;
