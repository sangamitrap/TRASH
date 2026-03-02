import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import RecycleIcon from '@mui/icons-material/Recycle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(12, 0),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '& svg': {
    fontSize: 40,
  },
}));

const HomePage: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <RecycleIcon />,
      title: 'Easy Waste Segregation',
      description: 'Upload photos of your segregated waste and earn points for proper disposal.',
    },
    {
      icon: <EmojiEventsIcon />,
      title: 'Earn Rewards',
      description: 'Redeem your points for exciting rewards, discounts, and special offers.',
    },
    {
      icon: <GroupIcon />,
      title: 'Join the Community',
      description: 'Connect with like-minded individuals and organizations committed to sustainability.',
    },
    {
      icon: <CheckCircleIcon />,
      title: 'Verified Impact',
      description: 'Track your environmental impact with verified waste disposal data.',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Make a Difference with WasteWise
          </Typography>
          <Typography variant="h5" component="p" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join our community of eco-conscious individuals and earn rewards for proper waste segregation.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/leaderboard"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
            >
              View Leaderboard
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
          How It Works
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[1, 2, 3, 4].map((step) => (
            <Grid item xs={12} sm={6} md={3} key={step}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 auto 16px',
                  }}
                >
                  {step}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {step === 1 && 'Sign Up & Log In'}
                  {step === 2 && 'Segregate Your Waste'}
                  {step === 3 && 'Upload & Verify'}
                  {step === 4 && 'Earn Points & Rewards'}
                </Typography>
                <Typography color="text.secondary">
                  {step === 1 && 'Create your account and join our eco-friendly community.'}
                  {step === 2 && 'Separate your waste into categories like dry, wet, and e-waste.'}
                  {step === 3 && 'Take a photo of your segregated waste and submit it for verification.'}
                  {step === 4 && 'Get points for proper segregation and redeem them for rewards.'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
          Why Choose WasteWise?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={3}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box bgcolor={theme.palette.grey[100]} py={8}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Ready to Make an Impact?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Join thousands of users who are making a difference in their communities by properly segregating waste and earning rewards.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
          >
            Start Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
