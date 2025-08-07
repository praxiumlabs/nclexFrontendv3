// src/pages/Profile/Profile.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, 
  Save, X, Camera, Shield, Key, Bell 
} from 'lucide-react';
import { Layout } from '../../components/layout/layout/layout';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { useAuth } from '../../hooks/useAuth';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.primary[100]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarSection = styled.div`
  position: relative;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: 3px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: scale(1.1);
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[50]};
    cursor: not-allowed;
  }
`;

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <Layout pageTitle="Profile" pageDescription="Manage your account settings">
      <ProfileContainer>
        <ProfileHeader>
          <AvatarSection>
            <Avatar 
              src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=10b981&color=fff`}
              alt={user?.name}
            />
            <AvatarUpload>
              <Camera size={20} />
            </AvatarUpload>
          </AvatarSection>
          
          <ProfileInfo>
            <ProfileName>{user?.name}</ProfileName>
            <ProfileEmail>{user?.email}</ProfileEmail>
          </ProfileInfo>
          
          <Button
            variant="outline"
            leftIcon={editing ? <X size={18} /> : <Edit3 size={18} />}
            onClick={editing ? handleCancel : () => setEditing(true)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </ProfileHeader>

        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Personal Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    disabled={!editing}
                    {...register('name')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled={!editing}
                    {...register('email')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    disabled={!editing}
                    {...register('phone')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    disabled={!editing}
                    {...register('location')}
                  />
                </FormGroup>
              </div>
              
              {editing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" leftIcon={<Save size={18} />}>
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card.Content>
        </Card>

        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Security</Card.Title>
          </Card.Header>
          <Card.Content>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontWeight: 600 }}>Password</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Change your account password
                </p>
              </div>
              <Button
                variant="outline"
                leftIcon={<Key size={18} />}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
        >
          <Modal.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormGroup>
                <Label>Current Password</Label>
                <Input type="password" />
              </FormGroup>
              <FormGroup>
                <Label>New Password</Label>
                <Input type="password" />
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </FormGroup>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button>Update Password</Button>
          </Modal.Footer>
        </Modal>
      </ProfileContainer>
    </Layout>
  );
};

export default Profile;

