import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Home } from './home.entity';


@Entity()
export class UserHomeRel {
    @PrimaryColumn()
    user_id: number;
    
    @PrimaryColumn()
    home_id: number;

    @ManyToOne(() => User, user => user.user_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Home, home => home.home_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'home_id' })
    home: Home;
}