import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email: string;
}