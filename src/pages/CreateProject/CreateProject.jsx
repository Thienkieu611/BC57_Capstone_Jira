import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { NavLink } from "react-router-dom";
import { createProject } from "../../utils/createProject";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toAliasString } from "./Alias";

const CreateProject = () => {
  const editorRef = useRef(null);
  const [projectCategory, setProjectCategory] = useState([]);
  const he = require("he");

  const formik = useFormik({
    initialValues: {
      projectName: "",
      projectCategory: "",
      description: "",
      alias: "",
    },
    onSubmit: (value) => {
      value.alias = toAliasString(value.projectName);
      const desContent = document.getElementById("description").value;
      const decodedContent = he.decode(desContent);
      const valueD = decodedContent.replace(/<[^>]*>/g, "");
      value.description = valueD;
      createProject
        .postData(value)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Project name is required"),
      projectCategory: Yup.string()
        .test("selectCheck", "Project category is required", function (value) {
          if (value !== "Select a project category") {
            return value !== "Select a project category";
          }
        })
        .required("Project category is required"),
    }),
  });

  const { handleChange, handleSubmit, handleBlur, touched, errors } = formik;

  useEffect(() => {
    createProject
      .getCategory()
      .then((res) => {
        // console.log(res);
        setProjectCategory(res.data.content);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container py-4 px-5">
      <p>
        <NavLink className="text-decoration-none text-secondary me-2 " to={"/"}>
          Projects
        </NavLink>
        <span>/ New project</span>
      </p>
      <h3>New project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
          <label htmlFor="exampleInputEmail1" className="mb-2 fw-semibold">
            Project name <span className="text-danger">*</span>
          </label>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control"
            id="projectName"
          />
          {errors.projectName && touched.projectName && (
            <p className="text-danger fs-6 mt-1">{errors.projectName}</p>
          )}
        </div>
        <div className="form-group">
          <label className="mb-2 fw-semibold">
            Project category <span className="text-danger">*</span>
          </label>
          <select
            onChange={handleChange}
            onBlur={handleBlur}
            class="form-control"
            id="projectCategory"
          >
            <option>Select a project category</option>
            {projectCategory.map((item, index) => {
              return (
                <option value={item.id}>{item.projectCategoryName}</option>
              );
            })}
          </select>
          {errors.projectCategory && touched.projectCategory && (
            <p className="text-danger fs-6 mt-1">{errors.projectCategory}</p>
          )}
        </div>
        <div className="mt-3">
          <label className="mb-2 fw-semibold">Descriptions</label>
          <Editor
            onChange={handleChange}
            onBlur={handleBlur}
            id="description"
            class="form-control"
            apiKey="9o0gtndzvm3cr870417b05dbgszexdivpnbmdnwwf0ydi4z2"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 250,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          {errors.description && touched.description && (
            <p className="text-danger fs-6 mt-1">{errors.description}</p>
          )}
        </div>

        <NavLink
          className="text-decoration-none btn bg-secondary text-white fs-6 my-3 me-2 "
          to={"/"}
        >
          Cancel
        </NavLink>
        <button type="submit" class="btn btn-primary fs-6 my-3">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
