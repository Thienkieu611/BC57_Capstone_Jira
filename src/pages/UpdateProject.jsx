import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { NavLink } from "react-router-dom";
import { createProject } from "./../utils/createProject";
import { updateProject } from "./../utils/updateProject";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateProject = () => {
  const editorRef = useRef(null);
  const he = require("he");
  const [projectCategoryData, setProjectCategoryData] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const formikRef = useRef(null);

  useEffect(() => {
    createProject
      .getCategory()
      .then((res) => {
        // console.log(res);
        setProjectCategoryData(res.data.content);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    updateProject
      .getProjectDetail()
      .then((res) => {
        console.log(res);
        setProjectDetail(res.data.content);
      })
      .catch((err) => console.log(err));
  }, []);

  const { id, projectName, projectCategory, description, creator } =
    projectDetail;

  const arrCreator = [creator];

  const formik = useFormik({
    initialValues: {
      id: 0,
      creator: 0,
      projectName: projectName,
      projectCategory: projectCategory,
      description: description,
    },
    onSubmit: (value) => {
      const desContent = document.getElementById("description").value;
      const decodedContent = he.decode(desContent);
      const valueD = decodedContent.replace(/<[^>]*>/g, "");
      value.description = valueD;
      if (value.projectCategory.name) {
        value.projectCategory = value.projectCategory.name;
      }
      value.id = id;
      value.creator = arrCreator.length;
      console.log(value);

      updateProject
        .putProjectDetail(id, value)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Project name is required"),
    }),
  });

  useEffect(() => {
    formikRef.current = formik;
  }, [formik]);

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("projectName", projectName);
      formikRef.current.setFieldValue("projectCategory", projectCategory);
      formikRef.current.setFieldValue("description", description);
    }
  }, [projectName, projectCategory, description]);

  const { handleChange, handleSubmit, handleBlur, touched, errors } = formik;

  return (
    <div className="container py-4 px-5">
      <p>
        <NavLink className="text-decoration-none text-secondary me-2 " to={"/"}>
          Projects /
        </NavLink>
        <NavLink className="text-decoration-none text-secondary me-2 " to={"/"}>
          Projects /
        </NavLink>
        <span>Project settings</span>
      </p>
      <h3>Update project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
          <label className="mb-2 fw-semibold">
            Project ID <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            value={id}
            id="projectID"
            disabled
            readonly
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="exampleInputEmail1" className="mb-2 fw-semibold">
            Project name <span className="text-danger">*</span>
          </label>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control"
            name="projectName"
            id="projectName"
            value={formik.values.projectName}
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
            name="projectCategory"
            id="projectCategory"
            value={formik.values.projectCategory}
          >
            {projectCategoryData.map((item, index) => {
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
            initialValue={formik.values.description}
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
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;
