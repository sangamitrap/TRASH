import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { createSubmission, clearSubmissionError } from '../features/submissions/submissionSlice';
import { selectIsLoading, selectError } from '../features/submissions/submissionSlice';

// Validation Schema
const validationSchema = Yup.object({
  wasteType: Yup.string().required('Please select a waste type'),
  notes: Yup.string().max(500, 'Notes should not exceed 500 characters'),
  // File validation is handled separately
});

// Styled Components
const DropzoneWrapper = styled(Paper)(({ theme, isDragActive, isDragReject }) => ({
  border: `2px dashed ${
    isDragReject 
      ? theme.palette.error.main 
      : isDragActive 
        ? theme.palette.primary.main 
        : theme.palette.divider
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? 'rgba(46, 125, 50, 0.05)' : theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '16px',
});

const wasteTypes = [
  { value: 'dry', label: 'Dry Waste', description: 'Paper, cardboard, plastic, metal, glass' },
  { value: 'wet', label: 'Wet Waste', description: 'Food scraps, vegetable peels, garden waste' },
  { value: 'e-waste', label: 'E-Waste', description: 'Electronics, batteries, cables, chargers' },
  { value: 'hazardous', label: 'Hazardous Waste', description: 'Chemicals, medical waste, sharp objects' },
  { value: 'other', label: 'Other', description: 'Items that don\'t fit other categories' },
];

const SubmitWastePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      wasteType: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!file) {
        formik.setFieldError('file', 'Please upload an image of your waste');
        return;
      }
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('wasteType', values.wasteType);
      if (values.notes) {
        formData.append('notes', values.notes);
      }
      
      const resultAction = await dispatch(createSubmission(formData));
      
      if (createSubmission.fulfilled.match(resultAction)) {
        setSubmissionSuccess(true);
        formik.resetForm();
        setFile(null);
        setPreview(null);
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmissionSuccess(false);
          navigate('/app/submissions');
        }, 5000);
      }
    },
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  if (submissionSuccess) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Submission Successful!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Thank you for your submission. Our team will review it shortly.
          </Typography>
          <Typography color="text.secondary" paragraph>
            You've earned points that will be added to your account after verification.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/app/dashboard')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Submit Waste
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload a photo of your properly segregated waste to earn points. Make sure the waste is clean and sorted correctly.
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearSubmissionError())}
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          {/* Left Column - Image Upload */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Upload Waste Photo
            </Typography>
            
            {preview ? (
              <Box position="relative">
                <PreviewImage src={preview} alt="Waste preview" />
                <IconButton
                  color="error"
                  aria-label="remove image"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <DropzoneWrapper 
                {...getRootProps()} 
                isDragActive={isDragActive}
                isDragReject={isDragReject}
                elevation={3}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon 
                  color={isDragReject ? 'error' : isDragActive ? 'primary' : 'action'} 
                  sx={{ fontSize: 48, mb: 2 }} 
                />
                <Typography variant="h6" gutterBottom>
                  {isDragActive 
                    ? 'Drop the image here' 
                    : isDragReject
                      ? 'File type not accepted'
                      : 'Drag & drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted formats: JPG, PNG (max 5MB)
                </Typography>
                {isDragReject && (
                  <Typography variant="caption" color="error" display="block" mt={1}>
                    Please upload an image file (jpg, png)
                  </Typography>
                )}
              </DropzoneWrapper>
            )}
            
            {!file && formik.touched.wasteType && formik.errors.wasteType && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Please upload an image of your waste
              </Alert>
            )}
            
            <Alert 
              severity="info" 
              icon={<InfoIcon />} 
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>Tips for a good photo:</strong>
              </Typography>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Ensure good lighting</li>
                <li>Capture the entire waste pile</li>
                <li>Show clear separation between waste types</li>
                <li>Avoid blurry or dark images</li>
              </ul>
            </Alert>
          </Grid>
          
          {/* Right Column - Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Waste Details
            </Typography>
            
            <FormControl 
              fullWidth 
              margin="normal"
              error={formik.touched.wasteType && Boolean(formik.errors.wasteType)}
            >
              <InputLabel id="waste-type-label">Waste Type *</InputLabel>
              <Select
                labelId="waste-type-label"
                id="wasteType"
                name="wasteType"
                value={formik.values.wasteType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Waste Type *"
                disabled={isLoading}
              >
                <MenuItem value="" disabled>
                  <em>Select a waste type</em>
                </MenuItem>
                {wasteTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <div>{type.label}</div>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.wasteType && formik.errors.wasteType && (
                <FormHelperText>{formik.errors.wasteType}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              id="notes"
              name="notes"
              label="Additional Notes (Optional)"
              placeholder="Add any additional information about your waste..."
              multiline
              rows={4}
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errorsnotes}
              disabled={isLoading}
            />
            
            <Box mt={4}>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Points: 
                <Box component="span" fontWeight="bold" color="primary.main" ml={1}>
                  {formik.values.wasteType 
                    ? wasteTypes.find(t => t.value === formik.values.wasteType)?.value === 'e-waste' ? '20' 
                      : wasteTypes.find(t => t.value === formik.values.wasteType)?.value === 'hazardous' ? '30' 
                      : wasteTypes.find(t => t.value === formik.values.wasteType)?.value === 'dry' ? '10' 
                      : '5' 
                    : '0'}
                  
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                * Points are awarded after verification. E-waste and hazardous waste earn more points.
              </Typography>
            </Box>
            
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={!file || !formik.values.wasteType || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Submitting...' : 'Submit Waste'}
              </Button>
            </Box>
            
            <Box mt={3}>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Your submission will be reviewed within 24-48 hours
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Points will be added to your account after verification
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SubmitWastePage;
