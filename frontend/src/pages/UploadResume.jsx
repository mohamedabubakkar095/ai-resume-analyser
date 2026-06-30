// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   Alert,
//   LinearProgress,
//   Stack,
// } from "@mui/material";
// import {
//   CloudUpload,
//   Description,
//   Send,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const UploadResume = () => {
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [jobTitle, setJobTitle] = useState("");
//   const [jobDescription, setJobDescription] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState("");

//   const handleFile = (e) => {
//     const selected = e.target.files[0];

//     if (!selected) return;

//     if (selected.type !== "application/pdf") {
//       setError("Please upload only PDF.");
//       return;
//     }

//     setError("");
//     setFile(selected);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setError("Please upload resume.");
//       return;
//     }

//     try {
//       setLoading(true);

//       setProgress(20);
//       setStatus("Uploading Resume...");

//       const formData = new FormData();
//       formData.append("file", file);

//       const upload = await api.post(
//         "resume/upload/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setProgress(60);
//       setStatus("Analyzing Resume...");

//       const result = await api.post(
//         "analysis/analyze/",
//         {
//           resume_id: upload.data.id,
//           job_title: jobTitle,
//           job_description_text: jobDescription,
//         }
//       );

//       setProgress(100);
//       setStatus("Completed");

//       navigate(`/report/${result.data.id}`);
//     } catch (err) {
//       console.log(err);

//       setError(
//         err?.response?.data?.detail ||
//         "Analysis Failed."
//       );

//       setLoading(false);
//       setProgress(0);
//     }
//   };

//   if (loading) {
//     return (
//       <Card sx={{ p: 5 }}>
//         <CardContent>

//           <CircularProgress />

//           <Typography mt={2}>
//             {status}
//           </Typography>

//           <LinearProgress
//             sx={{ mt: 3 }}
//             variant="determinate"
//             value={progress}
//           />

//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Box maxWidth="1000px" mx="auto">

//       <Typography
//         variant="h4"
//         fontWeight="bold"
//         mb={4}
//       >
//         AI Resume Analyzer
//       </Typography>

//       {error && (
//         <Alert sx={{ mb: 3 }} severity="error">
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit}>

//         {/* Stack instead of Grid */}

//         <Stack
//           direction={{
//             xs: "column",
//             md: "row",
//           }}
//           spacing={4}
//         >

//           <Box flex={1}>

//             <Card>

//               <CardContent>

//                 <Typography
//                   mb={2}
//                   variant="h6"
//                 >
//                   Upload Resume
//                 </Typography>

//                 {file ? (
//                   <>
//                     <Description color="primary" />

//                     <Typography mt={2}>
//                       {file.name}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                     >
//                       {(file.size / 1024).toFixed(2)} KB
//                     </Typography>

//                     <Button
//                       sx={{ mt: 2 }}
//                       variant="outlined"
//                       onClick={() => setFile(null)}
//                     >
//                       Change File
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <CloudUpload
//                       sx={{
//                         fontSize: 70,
//                         mb: 2,
//                       }}
//                     />

//                     <Button
//                       component="label"
//                       variant="contained"
//                     >
//                       Browse PDF

//                       <input
//                         hidden
//                         type="file"
//                         accept=".pdf"
//                         onChange={handleFile}
//                       />
//                     </Button>
//                   </>
//                 )}

//               </CardContent>

//             </Card>

//           </Box>

//           <Box flex={1}>

//             <Card>

//               <CardContent>

//                 <Typography
//                   variant="h6"
//                   mb={2}
//                 >
//                   Job Details
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   label="Job Title"
//                   value={jobTitle}
//                   onChange={(e) =>
//                     setJobTitle(e.target.value)
//                   }
//                   sx={{ mb: 3 }}
//                 />

//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={8}
//                   label="Job Description"
//                   value={jobDescription}
//                   onChange={(e) =>
//                     setJobDescription(
//                       e.target.value
//                     )
//                   }
//                 />

//                 <Button
//                   sx={{ mt: 3 }}
//                   fullWidth
//                   type="submit"
//                   variant="contained"
//                   endIcon={<Send />}
//                   disabled={!file}
//                 >
//                   Analyze Resume
//                 </Button>

//               </CardContent>

//             </Card>

//           </Box>

//         </Stack>

//       </form>

//     </Box>
//   );
// };

// export default UploadResume;
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  Send,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UploadResume = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload only PDF.");
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload resume.");
      return;
    }

    try {
      setLoading(true);

      setProgress(20);
      setStatus("Uploading Resume...");

      const formData = new FormData();
      formData.append("file", file);

      const upload = await api.post(
        "resume/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProgress(60);
      setStatus("Analyzing Resume...");

      const result = await api.post(
        "analysis/analyze/",
        {
          resume_id: upload.data.id,
          job_title: jobTitle,
          job_description_text: jobDescription,
        }
      );

      setProgress(100);
      setStatus("Completed");

      navigate(`/report/${result.data.id}`);
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.detail ||
        "Analysis Failed."
      );

      setLoading(false);
      setProgress(0);
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 5 }}>
        <CardContent>

          <CircularProgress />

          <Typography mt={2}>
            {status}
          </Typography>

          <LinearProgress
            sx={{ mt: 3 }}
            variant="determinate"
            value={progress}
          />

        </CardContent>
      </Card>
    );
  }

  return (
    /* Fixed: maxWidth and mx styles moved into the sx prop */
    <Box sx={{ maxWidth: "1000px", mx: "auto" }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        AI Resume Analyzer
      </Typography>

      {error && (
        <Alert sx={{ mb: 3 }} severity="error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>

        {/* Stack instead of Grid */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={4}
        >

          <Box flex={1}>

            <Card>

              <CardContent>

                <Typography
                  mb={2}
                  variant="h6"
                >
                  Upload Resume
                </Typography>

                {file ? (
                  <>
                    <Description color="primary" />

                    <Typography mt={2}>
                      {file.name}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>

                    <Button
                      sx={{ mt: 2 }}
                      variant="outlined"
                      onClick={() => setFile(null)}
                    >
                      Change File
                    </Button>
                  </>
                ) : (
                  <>
                    <CloudUpload
                      sx={{
                        fontSize: 70,
                        mb: 2,
                      }}
                    />

                    <Button
                      component="label"
                      variant="contained"
                    >
                      Browse PDF

                      <input
                        hidden
                        type="file"
                        accept=".pdf"
                        onChange={handleFile}
                      />
                    </Button>
                  </>
                )}

              </CardContent>

            </Card>

          </Box>

          <Box flex={1}>

            <Card>

              <CardContent>

                <Typography
                  variant="h6"
                  mb={2}
                >
                  Job Details
                </Typography>

                <TextField
                  fullWidth
                  label="Job Title"
                  value={jobTitle}
                  onChange={(e) =>
                    setJobTitle(e.target.value)
                  }
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Job Description"
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(
                      e.target.value
                    )
                  }
                />

                <Button
                  sx={{ mt: 3 }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  disabled={!file}
                >
                  Analyze Resume
                </Button>

              </CardContent>

            </Card>

          </Box>

        </Stack>

      </form>

    </Box>
  );
};

export default UploadResume;


