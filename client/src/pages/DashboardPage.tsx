import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from '@mui/material';
import { 
  Recycle as RecycleIcon, 
  EmojiEvents as EmojiEventsIcon, 
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getSubmissions, selectSubmissions, selectTotalPoints, selectIsLoading } from '../features/submissions/submissionSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const submissions = useSelector(selectSubmissions);
  const totalPoints = useSelector(selectTotalPoints);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getSubmissions());
  }, [dispatch]);

  const recentSubmissions = submissions.slice(0, 5);
  
  const stats = [
    {
      title: 'Total Points',
      value: totalPoints,
      icon: <EmojiEventsIcon />,
      description: 'Your total earned points',
    },
    {
      title: 'Submissions',
      value: submissions.length,
      icon: <RecycleIcon />,
      description: 'Total waste submissions',
    },
    {
      title: 'Approval Rate',
      value: submissions.length > 0 
        ? `${Math.round((submissions.filter(s => s.status === 'approved').length / submissions.length) * 100)}%` 
        : 'N/A',
      icon: <TrendingUpIcon />,
      description: 'Percentage of approved submissions',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Here's your waste segregation summary and recent activities.
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard>
              <StatCardContent>
                {stat.icon}
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.description}
                  </Typography>
                </Box>
              </StatCardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        {/* Recent Submissions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" component="h2" fontWeight="bold">
                Recent Submissions
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                href="/app/submissions"
              >
                View All
              </Button>
            </Box>
            
            {recentSubmissions.length > 0 ? (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {recentSubmissions.map((submission, index) => (
                  <React.Fragment key={submission._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar 
                          src={submission.image} 
                          alt="Waste submission"
                          variant="rounded"
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${submission.wasteType.charAt(0).toUpperCase() + submission.wasteType.slice(1)} Waste`}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              {getStatusIcon(submission.status)}
                              {getStatusText(submission.status)}
                            </Typography>
                            {new Date(submission.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </React.Fragment>
                        }
                      />
                      <Box textAlign="right">
                        <Typography variant="subtitle1" color="primary" fontWeight="bold">
                          +{submission.pointsAwarded} pts
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < recentSubmissions.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="200px"
                textAlign="center"
                p={3}
              >
                <RecycleIcon color="action" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No submissions yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mb: 2 }}>
                  Start your waste segregation journey by submitting your first waste disposal.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<RecycleIcon />}
                  href="/app/submit-waste"
                >
                  Submit Waste
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" component="h2" fontWeight="bold" mb={3}>
              Quick Actions
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                startIcon={<RecycleIcon />}
                href="/app/submit-waste"
                sx={{ justifyContent: 'flex-start' }}
              >
                Submit Waste
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                size="large"
                startIcon={<EmojiEventsIcon />}
                href="/leaderboard"
                sx={{ justifyContent: 'flex-start' }}
              >
                View Leaderboard
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                size="large"
                startIcon={<CheckCircleIcon />}
                href="/app/submissions"
                sx={{ justifyContent: 'flex-start' }}
              >
                My Submissions
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Your Impact
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Waste Diverted</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(submissions.length * 2.5)} kg
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">CO₂ Reduced</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(submissions.length * 0.8)} kg
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Community Rank</Typography>
                <Typography variant="body2" fontWeight="bold">
                  #{Math.ceil(Math.random() * 100)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
