using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SpaceAPI.Models;

namespace SpaceAPI
{
    public partial class galaxyContext : DbContext
    {
        public galaxyContext()
        {
        }

        public galaxyContext(DbContextOptions<galaxyContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Battlelog> Battlelogs { get; set; } = null!;
        public virtual DbSet<Exploration> Explorations { get; set; } = null!;
        public virtual DbSet<Fleet> Fleets { get; set; } = null!;
        public virtual DbSet<Message> Messages { get; set; } = null!;
        public virtual DbSet<Planet> Planets { get; set; } = null!;
        public virtual DbSet<Resource> Resources { get; set; } = null!;
        public virtual DbSet<Ship> Ships { get; set; } = null!;
        public virtual DbSet<Shipyardqueue> Shipyardqueues { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        // Magic
        public virtual DbSet<MessageWithUsernames> MessageWithUsernames { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;database=galaxy;user=root;ssl mode=none", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.27-mariadb"));
            }
        }

        // Magic
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8_hungarian_ci")
                .HasCharSet("utf8");

            modelBuilder.Entity<MessageWithUsernames>(entity =>
            {
                entity.Property(e => e.Receiver);
                
                entity.Property(e => e.Sender);
                
                entity.Property(e => e.Message);

                entity.Property(e => e.IsReceiverDeleted);

                entity.Property(e => e.IsSenderDeleted);
                
                entity.Property(e => e.Date);
                
                modelBuilder.Entity<MessageWithUsernames>().HasNoKey();
            });

            modelBuilder.Entity<Battlelog>(entity =>
            {
                entity.ToTable("battlelog");

                entity.HasIndex(e => e.Uid, "uid")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Score)
                    .HasColumnType("int(11)")
                    .HasColumnName("score");

                entity.Property(e => e.Uid)
                    .HasColumnType("int(11)")
                    .HasColumnName("uid");
            });

            modelBuilder.Entity<Exploration>(entity =>
            {
                entity.ToTable("exploration");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Cooldownenddate)
                    .HasColumnType("datetime")
                    .HasColumnName("cooldownenddate");

                entity.Property(e => e.Pid)
                    .HasColumnType("int(11)")
                    .HasColumnName("pid");
            });

            modelBuilder.Entity<Fleet>(entity =>
            {
                entity.ToTable("fleet");

                entity.HasIndex(e => e.Pid, "pid");

                entity.HasIndex(e => e.Sid, "sid");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Count)
                    .HasColumnType("int(11)")
                    .HasColumnName("count");

                entity.Property(e => e.Pid)
                    .HasColumnType("int(11)")
                    .HasColumnName("pid");

                entity.Property(e => e.Sid)
                    .HasColumnType("int(11)")
                    .HasColumnName("sid");

                entity.HasOne(d => d.PidNavigation)
                    .WithMany(p => p.Fleets)
                    .HasForeignKey(d => d.Pid)
                    .HasConstraintName("fk_planet_fle");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("message");

                entity.HasCharSet("utf8")
                    .UseCollation("utf8_hungarian_ci");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.MessageBody)
                    .HasColumnType("text")
                    .HasColumnName("message");

                entity.Property(e => e.Receiverdeleted).HasColumnName("receiverdeleted");

                entity.Property(e => e.Recieverid)
                    .HasColumnType("int(11)")
                    .HasColumnName("recieverid");

                entity.Property(e => e.Senderdeleted).HasColumnName("senderdeleted");

                entity.Property(e => e.Senderid)
                    .HasColumnType("int(11)")
                    .HasColumnName("senderid");
            });

            modelBuilder.Entity<Planet>(entity =>
            {
                entity.ToTable("planet");

                entity.HasIndex(e => e.Uid, "uid")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Hqlvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("hqlvl");

                entity.Property(e => e.Name)
                    .HasMaxLength(30)
                    .HasColumnName("name");

                entity.Property(e => e.Refinerylvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("refinerylvl");

                entity.Property(e => e.Shipyardlvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("shipyardlvl");

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .HasColumnName("type");

                entity.Property(e => e.Uid)
                    .HasColumnType("int(11)")
                    .HasColumnName("uid");

                entity.HasOne(d => d.UidNavigation)
                    .WithOne(p => p.Planet)
                    .HasForeignKey<Planet>(d => d.Uid)
                    .HasConstraintName("fk_user");
            });

            modelBuilder.Entity<Resource>(entity =>
            {
                entity.ToTable("resources");

                entity.HasIndex(e => e.Pid, "fk_planet_res");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Carboncount)
                    .HasColumnType("int(11)")
                    .HasColumnName("carboncount");

                entity.Property(e => e.Carbonlvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("carbonlvl");

                entity.Property(e => e.Gascount)
                    .HasColumnType("int(11)")
                    .HasColumnName("gascount");

                entity.Property(e => e.Gaslvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("gaslvl");

                entity.Property(e => e.Lastupdate)
                    .HasColumnType("datetime")
                    .HasColumnName("lastupdate");

                entity.Property(e => e.Pid)
                    .HasColumnType("int(11)")
                    .HasColumnName("pid");

                entity.Property(e => e.Steelcount)
                    .HasColumnType("int(11)")
                    .HasColumnName("steelcount");

                entity.Property(e => e.Steellvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("steellvl");

                entity.Property(e => e.Uraniumcount)
                    .HasColumnType("int(11)")
                    .HasColumnName("uraniumcount");

                entity.Property(e => e.Uraniumlvl)
                    .HasColumnType("int(11)")
                    .HasColumnName("uraniumlvl");

                entity.HasOne(d => d.PidNavigation)
                    .WithMany(p => p.Resources)
                    .HasForeignKey(d => d.Pid)
                    .HasConstraintName("fk_planet_res");
            });

            modelBuilder.Entity<Ship>(entity =>
            {
                entity.ToTable("ship");

                entity.HasIndex(e => new { e.Classid, e.Weapontype, e.Defensetype, e.Propulsiontype }, "U_Ship")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Classid)
                    .HasColumnType("int(11)")
                    .HasColumnName("classid");

                entity.Property(e => e.Defensetype)
                    .HasColumnType("int(11)")
                    .HasColumnName("defensetype");

                entity.Property(e => e.Propulsiontype)
                    .HasColumnType("int(11)")
                    .HasColumnName("propulsiontype");

                entity.Property(e => e.Weapontype)
                    .HasColumnType("int(11)")
                    .HasColumnName("weapontype");
            });

            modelBuilder.Entity<Shipyardqueue>(entity =>
            {
                entity.ToTable("shipyardqueue");

                entity.HasIndex(e => e.Pid, "fk_planet_syq");

                entity.HasIndex(e => e.Sid, "sid");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Done)
                    .HasColumnType("datetime")
                    .HasColumnName("done");

                entity.Property(e => e.Pid)
                    .HasColumnType("int(11)")
                    .HasColumnName("pid");

                entity.Property(e => e.Sid)
                    .HasColumnType("int(11)")
                    .HasColumnName("sid");

                entity.HasOne(d => d.PidNavigation)
                    .WithMany(p => p.Shipyardqueues)
                    .HasForeignKey(d => d.Pid)
                    .HasConstraintName("fk_planet_syq");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.HasIndex(e => e.EMail, "email")
                    .IsUnique();

                entity.HasIndex(e => e.Username, "username")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.EMail)
                    .HasMaxLength(50)
                    .HasColumnName("email");

                entity.Property(e => e.PWHash)
                    .HasColumnType("blob")
                    .HasColumnName("pwHash");

                entity.Property(e => e.PWSalt)
                    .HasColumnType("blob")
                    .HasColumnName("pwSalt");

                entity.Property(e => e.Username)
                    .HasMaxLength(30)
                    .HasColumnName("username");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
