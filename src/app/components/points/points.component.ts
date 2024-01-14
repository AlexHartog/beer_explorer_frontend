import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Points } from '../../models/stats';
import { PointsService } from '../../services/points.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, MatTableModule ],
  templateUrl: './points.component.html',
  styleUrl: './points.component.scss'
})
export class PointsComponent implements OnInit {


  // points: Points[] = [];

  points: MatTableDataSource<Points> = new MatTableDataSource<Points>([]);
  displayedColumns: string[] = ['user', 'weeks', 'points', 'unique', 'bars'];

  constructor(private pointsService: PointsService) {}

  ngOnInit(): void {
    this.getPoints();
  }

  getPoints(): void {
    this.pointsService.getPoints()
      .subscribe(points => {
        const sortedPoints = points.sort((a, b) => a.points_weeks == b.points_weeks ? (a.total_points > b.total_points ? -1 : 1) : (a.points_weeks > b.points_weeks ? -1 : 1) );
        this.points = new MatTableDataSource<Points>(sortedPoints);
      });
  }
}
