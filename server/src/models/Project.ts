import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { Task } from './Task';

@Table
export class Project extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @HasMany(() => Task)
  tasks!: Task[];
}