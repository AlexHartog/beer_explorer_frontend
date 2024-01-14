import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { Checkin } from '../../models/checkin';
import { CheckinService } from '../../services/checkin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// interface FilterValues {
//   [key: string]: string;
// }

@Component({
  selector: 'app-checkin-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './checkin-list.component.html',
  styleUrl: './checkin-list.component.scss'
})
export class CheckinListComponent {
  // beers: Beer[] = [];
  checkins: MatTableDataSource<Checkin> = new MatTableDataSource<Checkin>([]);
  displayedColumns: string[] = ['date', 'user', 'brand', 'beerType', 'beerName', 'percentage', 'inBar', 'rating', 'delete'];
  // filterValues: FilterValues = {};

  constructor(
    private checkinService: CheckinService,
    private dialog: MatDialog,
  ) {
    // this.checkins.filterPredicate = this.createFilter();
  }


  ngOnInit(): void {
    this.getCheckins();
  }

  getCheckins(): void {
    this.checkinService.getCheckins()
      .subscribe(checkins => {
        this.checkins = new MatTableDataSource<Checkin>(checkins);
      });
  }

  onDelete(checkinId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {id: checkinId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checkinService.deleteCheckin(checkinId).subscribe({
          next: () => {
            console.log("Deleted object");
          },
          error: error => {
            console.error("Got an error while deleting: ", error)
          }
        });
      }
    });

  }

  // applyFilter(filterValue: string, column: string) {
  //   console.log("Filtervalue: ", filterValue);
  //   console.log("Column: ", column);
  //   this.filterValues[column] = filterValue.trim().toLowerCase();
  //   console.log("Filter values: ", this.filterValues);
  //   this.checkins.filter = JSON.stringify(this.filterValues);
  // }

  // createFilter(): (data: any, filter: string) => boolean {
  //   console.log("Creating filter")
  //   return (data, filter): boolean => {
  //     const searchString = JSON.parse(filter);
  //     return Object.keys(searchString).every(key => {
  //       console.log("Finding")
  //       if (!searchString[key]) {
  //         return true;
  //       }
  //       return data[key].toString().toLowerCase().includes(searchString[key]);
  //     });
  //   };
  // }
  
}
