import React from "react"
import { Card, Image } from "semantic-ui-react"
import ProfileBio from '../ProfileBio'
import userNotFound from 'assets/images/userNotFound.png'
import './styles.scss'

export default function ProfileCard({
  user,
}) {
  return (
    <div className='profile-card'>
      {user && (
        <Card>
          <Image src={user.avatar ? `${process.env.REACT_APP_BASE_URL}/users/${user._id}/avatar` : userNotFound} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{user.name}</Card.Header>
            <Card.Meta>
              <span className="date">Joined in {new Date(user.createdAt).getFullYear()}</span>
            </Card.Meta>
            <Card.Description>
              <ProfileBio bio={user.bio} />
            </Card.Description>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
